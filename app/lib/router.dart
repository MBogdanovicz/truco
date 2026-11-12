import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'data/auth_repository.dart';
import 'data/crash_reporting.dart';
import 'features/auth/login_screen.dart';
import 'features/auth/onboarding_screen.dart';
import 'features/groups/group_detail_screen.dart';
import 'features/groups/groups_screen.dart';
import 'features/groups/join_group_screen.dart';
import 'features/game/game_setup_screen.dart';
import 'features/game/game_table_screen.dart';
import 'features/game/online_game_screen.dart';
import 'domain/game/rules.dart';
import 'features/game/rules_screen.dart';
import 'features/game/training_screen.dart';
import 'features/history/history_screen.dart';
import 'features/premium/premium_screen.dart';
import 'features/ranking/ranking_screen.dart';
import 'features/home/home_screen.dart';
import 'features/startup/startup_checks.dart';
import 'features/scorekeeper/join_room_screen.dart';
import 'features/scorekeeper/mode_screen.dart';
import 'features/scorekeeper/nearby_screen.dart';
import 'features/achievements/achievements_screen.dart';
import 'features/tournaments/create_tournament_screen.dart';
import 'features/tournaments/tournament_screen.dart';
import 'features/tournaments/tournaments_screen.dart';
import 'features/tournaments/watch_match_screen.dart';
import 'features/scorekeeper/online_room_screen.dart';
import 'features/scorekeeper/scoreboard_screen.dart';
import 'features/scorekeeper/setup_screen.dart';

/// Pure redirect rule, kept separate for testing.
///
/// Without Supabase configured the app is offline-only and never asks for a
/// login. Otherwise an account (with a display name) is required.
String? authRedirect({
  required bool authAvailable,
  required AppUser? user,
  required String location,
  String? uri,
}) {
  if (!authAvailable) {
    return location.startsWith('/entrar') ? '/' : null;
  }
  if (user == null) {
    if (location == '/entrar') return null;
    // Keep deep links (e.g. a room invite) across the login.
    final target = uri ?? location;
    return target == '/'
        ? '/entrar'
        : '/entrar?de=${Uri.encodeComponent(target)}';
  }
  if (user.needsOnboarding) {
    if (location == '/entrar/nome') return null;
    final from = _fromParam(uri);
    return from == null
        ? '/entrar/nome'
        : '/entrar/nome?de=${Uri.encodeComponent(from)}';
  }
  if (location.startsWith('/entrar')) return _fromParam(uri) ?? '/';
  return null;
}

String _withCode(String path, String? code) => code == null || code.isEmpty
    ? path
    : '$path?codigo=${Uri.encodeQueryComponent(code)}';

String? _fromParam(String? uri) {
  if (uri == null) return null;
  final from = Uri.tryParse(uri)?.queryParameters['de'];
  return from != null && from.startsWith('/') && !from.startsWith('/entrar')
      ? from
      : null;
}

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authRepositoryProvider);
  final refresh = AuthRefreshListenable(auth.watchUser());
  ref.onDispose(refresh.dispose);

  return GoRouter(
    refreshListenable: refresh,
    redirect: (context, state) {
      // Breadcrumb for crash reports (route path only, no query values).
      CrashReporting.log('route ${state.matchedLocation}');
      return authRedirect(
        authAvailable: auth.isAvailable,
        user: auth.currentUser,
        location: state.matchedLocation,
        uri: state.uri.toString(),
      );
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (_, _) => const StartupChecks(child: HomeScreen()),
        routes: [
          GoRoute(
            path: 'marcador/novo',
            builder: (_, _) => const ScorekeeperModeScreen(),
            routes: [
              GoRoute(
                path: 'local',
                builder: (_, _) => const ScorekeeperSetupScreen(),
              ),
              // Under "Novo marcador", so going back returns there.
              GoRoute(path: 'perto', builder: (_, _) => const NearbyScreen()),
            ],
          ),
          GoRoute(
            path: 'marcador/entrar',
            builder: (_, state) => JoinRoomScreen(
              initialCode: state.uri.queryParameters['codigo'],
            ),
          ),
          GoRoute(
            path: 'marcador/sala',
            builder: (_, _) => const OnlineRoomScreen(),
          ),
          GoRoute(
            path: 'marcador/partida',
            builder: (_, _) => const ScoreboardScreen(),
          ),
          GoRoute(
            path: 'jogo',
            builder: (_, _) => const GameSetupScreen(),
            routes: [
              GoRoute(
                path: 'partida',
                builder: (_, _) => const GameTableScreen(),
              ),
              GoRoute(
                path: 'sala',
                builder: (_, _) => const OnlineGameScreen(),
              ),
              GoRoute(
                path: 'entrar',
                builder: (_, state) => JoinGameScreen(
                  initialCode: state.uri.queryParameters['codigo'],
                ),
              ),
              GoRoute(
                path: 'treinar',
                builder: (_, _) => const TrainingScreen(),
              ),
              GoRoute(
                path: 'regras',
                builder: (_, state) => RulesScreen(
                  fixedManilhas: state.uri.queryParameters['fixas'] == '1',
                  table: state.extra is TrucoRules
                      ? state.extra! as TrucoRules
                      : null,
                ),
              ),
            ],
          ),
          GoRoute(path: 'historico', builder: (_, _) => const HistoryScreen()),
          GoRoute(path: 'ranking', builder: (_, _) => const RankingScreen()),
          GoRoute(
            path: 'conquistas',
            builder: (_, _) => const AchievementsScreen(),
          ),
          GoRoute(path: 'premium', builder: (_, _) => const PremiumScreen()),
          GoRoute(
            path: 'torneios',
            builder: (_, _) => const TournamentsScreen(),
            routes: [
              GoRoute(
                path: 'novo',
                builder: (_, _) => const CreateTournamentScreen(),
              ),
              GoRoute(
                path: 'assistir/:room',
                builder: (_, state) =>
                    WatchMatchScreen(roomId: state.pathParameters['room']!),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    TournamentScreen(id: state.pathParameters['id']!),
              ),
            ],
          ),
          // Nested so the back button of a group goes to the group list.
          GoRoute(
            path: 'grupos',
            builder: (_, _) => const GroupsScreen(),
            routes: [
              GoRoute(
                path: 'entrar',
                builder: (_, state) => JoinGroupScreen(
                  initialCode: state.uri.queryParameters['codigo'],
                ),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) =>
                    GroupDetailScreen(groupId: state.pathParameters['id']!),
              ),
            ],
          ),
        ],
      ),
      // Invite links opened in the Android app (see Env.roomInviteLink).
      GoRoute(
        path: '/sala',
        redirect: (_, state) => _withCode(
          // Game rooms add "&jogo=1" to the scorekeeper's invite link.
          state.uri.queryParameters['jogo'] == '1'
              ? '/jogo/entrar'
              : '/marcador/entrar',
          state.uri.queryParameters['codigo'],
        ),
      ),
      GoRoute(
        path: '/grupo',
        redirect: (_, state) =>
            _withCode('/grupos/entrar', state.uri.queryParameters['codigo']),
      ),
      GoRoute(path: '/entrar', builder: (_, _) => const LoginScreen()),
      GoRoute(
        path: '/entrar/nome',
        builder: (_, _) => const OnboardingScreen(),
      ),
    ],
  );
});

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'data/auth_repository.dart';
import 'features/auth/login_screen.dart';
import 'features/auth/onboarding_screen.dart';
import 'features/groups/group_detail_screen.dart';
import 'features/groups/groups_screen.dart';
import 'features/groups/join_group_screen.dart';
import 'features/history/history_screen.dart';
import 'features/ranking/ranking_screen.dart';
import 'features/home/home_screen.dart';
import 'features/scorekeeper/join_room_screen.dart';
import 'features/scorekeeper/mode_screen.dart';
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
    redirect: (context, state) => authRedirect(
      authAvailable: auth.isAvailable,
      user: auth.currentUser,
      location: state.matchedLocation,
      uri: state.uri.toString(),
    ),
    routes: [
      GoRoute(
        path: '/',
        builder: (_, _) => const HomeScreen(),
        routes: [
          GoRoute(
            path: 'marcador/novo',
            builder: (_, _) => const ScorekeeperModeScreen(),
          ),
          GoRoute(
            path: 'marcador/novo/local',
            builder: (_, _) => const ScorekeeperSetupScreen(),
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
          GoRoute(path: 'historico', builder: (_, _) => const HistoryScreen()),
          GoRoute(path: 'ranking', builder: (_, _) => const RankingScreen()),
          GoRoute(path: 'grupos', builder: (_, _) => const GroupsScreen()),
          GoRoute(
            path: 'grupos/entrar',
            builder: (_, state) => JoinGroupScreen(
              initialCode: state.uri.queryParameters['codigo'],
            ),
          ),
          GoRoute(
            path: 'grupos/:id',
            builder: (_, state) =>
                GroupDetailScreen(groupId: state.pathParameters['id']!),
          ),
        ],
      ),
      GoRoute(path: '/entrar', builder: (_, _) => const LoginScreen()),
      GoRoute(
        path: '/entrar/nome',
        builder: (_, _) => const OnboardingScreen(),
      ),
    ],
  );
});

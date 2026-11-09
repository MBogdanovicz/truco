import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'data/auth_repository.dart';
import 'features/auth/login_screen.dart';
import 'features/auth/onboarding_screen.dart';
import 'features/history/history_screen.dart';
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
}) {
  if (!authAvailable) {
    return location.startsWith('/entrar') ? '/' : null;
  }
  if (user == null) return location == '/entrar' ? null : '/entrar';
  if (user.needsOnboarding) {
    return location == '/entrar/nome' ? null : '/entrar/nome';
  }
  return location.startsWith('/entrar') ? '/' : null;
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
            builder: (_, _) => const JoinRoomScreen(),
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

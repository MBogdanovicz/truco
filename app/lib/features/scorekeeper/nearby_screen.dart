import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth_repository.dart';
import '../../data/nearby/nearby_link.dart';
import '../../data/nearby/nearby_match_channel.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/theme/app_theme.dart';
import 'online_room_controller.dart';

/// Rooms between phones at the same table, without internet (Android).
/// Create a room here, or join one that a nearby phone is advertising.
class NearbyScreen extends ConsumerStatefulWidget {
  const NearbyScreen({super.key});

  @override
  ConsumerState<NearbyScreen> createState() => _NearbyState();
}

class _NearbyState extends ConsumerState<NearbyScreen> {
  late final NearbyLink _link = ref.read(nearbyLinkProvider);
  StreamSubscription<NearbyEvent>? _sub;
  final _rooms = <String, NearbyRoomAd>{};
  bool? _allowed;
  bool _busy = false;
  bool _left = false;

  @override
  void initState() {
    super.initState();
    _start();
  }

  Future<void> _start() async {
    final ok = await _link.ensurePermissions();
    if (!mounted) return;
    setState(() => _allowed = ok);
    if (!ok) return;
    _sub = _link.events.listen((e) {
      switch (e) {
        case EndpointFound():
          final ad = NearbyRoomAd.decode(e.endpointId, e.name);
          if (ad != null) setState(() => _rooms[e.endpointId] = ad);
        case EndpointLost():
          setState(() => _rooms.remove(e.endpointId));
        default:
          break;
      }
    });
    try {
      await _link.startDiscovery();
    } on Object catch (e) {
      debugPrint('Nearby discovery failed: $e');
      if (mounted) {
        showAppToast(
          context,
          'Não foi possível procurar salas. Ligue o Bluetooth e o Wi-Fi.',
        );
      }
    }
  }

  @override
  void dispose() {
    _sub?.cancel();
    if (!_left) _link.stopDiscovery().catchError((_) {});
    super.dispose();
  }

  Future<void> _run(Future<void> Function() action, String error) async {
    setState(() => _busy = true);
    try {
      await _sub?.cancel();
      _sub = null;
      await _link.stopDiscovery();
      await action();
      _left = true;
      if (mounted) context.go('/marcador/sala');
    } on Object catch (e) {
      debugPrint('Nearby: $e');
      if (mounted) {
        showAppToast(context, error);
        setState(() {
          _busy = false;
          _rooms.clear();
        });
        await _start();
      }
    }
  }

  Future<void> _create() => _run(
    () => ref.read(onlineRoomControllerProvider.notifier).createNearby(),
    'Não foi possível criar a sala. Ligue o Bluetooth e o Wi-Fi.',
  );

  Future<void> _join(NearbyRoomAd ad) => _run(
    () => ref.read(onlineRoomControllerProvider.notifier).joinNearby(ad),
    'Não foi possível entrar na sala de ${ad.hostName}. Tente de novo.',
  );

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final Widget body;
    if (_busy || _allowed == null) {
      body = const Center(child: AppProgress());
    } else if (_allowed == false) {
      body = Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Para achar os celulares por perto, o app precisa das '
                'permissões de dispositivos próximos e localização.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              AppButton(label: 'Permitir', onPressed: _start),
            ],
          ),
        ),
      );
    } else {
      body = ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Funciona sem internet, entre celulares Android na mesma mesa. '
            'Deixe o Bluetooth e o Wi-Fi ligados.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          if (ref.read(authRepositoryProvider).currentUser?.isGuest ?? false)
            Text(
              'Para criar salas, entre com seu e-mail. Sem conta você pode '
              'entrar na sala de alguém.',
              style: theme.textTheme.bodySmall,
            )
          else
            AppButton(
              label: 'Criar sala aqui',
              icon: Icons.add,
              onPressed: _create,
            ),
          const SizedBox(height: 24),
          Text('Salas por perto', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_rooms.isEmpty)
            const ListTile(
              leading: SizedBox.square(
                dimension: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
              title: Text('Procurando…'),
              subtitle: Text(
                'Peça para quem criou a sala deixar o app aberto.',
              ),
            ),
          for (final ad in _rooms.values)
            Card(
              child: ListTile(
                leading: const CircleAvatar(
                  backgroundColor: AppColors.felt,
                  child: Icon(Icons.groups, color: Colors.white),
                ),
                title: Text('Sala de ${ad.hostName}'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => _join(ad),
              ),
            ),
        ],
      );
    }
    return AppScaffold(title: 'Por perto', body: body);
  }
}

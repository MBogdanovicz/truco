import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/last_room_repository.dart';
import '../../data/online_room_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'online_room_controller.dart';

class JoinRoomScreen extends ConsumerStatefulWidget {
  const JoinRoomScreen({super.key, this.initialCode});

  /// Code from an invite link; the screen joins right away.
  final String? initialCode;

  @override
  ConsumerState<JoinRoomScreen> createState() => _JoinState();
}

class _JoinState extends ConsumerState<JoinRoomScreen> {
  late final _code = TextEditingController(
    text: widget.initialCode?.toUpperCase() ?? '',
  );

  @override
  void initState() {
    super.initState();
    if ((widget.initialCode ?? '').length == 6) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _join());
    }
  }

  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  Future<void> _join() async {
    final code = _code.text.trim().toUpperCase();
    if (code.length != 6) {
      setState(() => _error = 'O código tem 6 letras e números.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(onlineRoomControllerProvider.notifier).join(code);
      if (mounted) context.go('/marcador/sala');
    } on RoomNotFound {
      setState(() => _error = 'Nenhuma sala aberta com esse código.');
      final last = ref.read(lastRoomRepositoryProvider);
      if (await last.load() == code) {
        await last.clear();
        ref.invalidate(lastRoomCodeProvider);
      }
    } on Object catch (e) {
      debugPrint('Join failed: $e');
      setState(
        () => _error = 'Não foi possível entrar. Verifique sua internet.',
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Entrar na sala',
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text(
            'Digite o código que aparece no celular de quem criou a sala.',
          ),
          const SizedBox(height: 24),
          AppTextField(
            controller: _code,
            label: 'Código',
            autofocus: true,
            maxLength: 6,
            textCapitalization: TextCapitalization.characters,
            onSubmitted: (_) => _join(),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(
              _error!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ],
          const SizedBox(height: 24),
          _busy
              ? const Center(child: AppProgress())
              : AppButton(label: 'Entrar', onPressed: _join),
        ],
      ),
    );
  }
}

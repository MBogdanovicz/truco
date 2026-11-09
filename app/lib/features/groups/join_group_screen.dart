import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/groups_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

class JoinGroupScreen extends ConsumerStatefulWidget {
  const JoinGroupScreen({super.key, this.initialCode});

  /// Code from an invite link; the screen joins right away.
  final String? initialCode;

  @override
  ConsumerState<JoinGroupScreen> createState() => _JoinGroupState();
}

class _JoinGroupState extends ConsumerState<JoinGroupScreen> {
  late final _code = TextEditingController(
    text: widget.initialCode?.toUpperCase() ?? '',
  );
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    if ((widget.initialCode ?? '').length == 6) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _join());
    }
  }

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
      final group = await ref.read(groupsRepositoryProvider)!.join(code: code);
      ref.invalidate(myGroupsProvider);
      if (mounted) context.go('/grupos/${group.id}');
    } on GroupNotFound {
      setState(() => _error = 'Nenhum grupo com esse código.');
    } on GroupLimitReached {
      setState(
        () => _error = 'Na versão grátis você pode estar em até 2 grupos. Com o Premium, sem limite.',
      );
    } on Object {
      setState(
        () => _error = 'Não foi possível entrar. Verifique sua internet.',
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => AppScaffold(
    title: 'Entrar em um grupo',
    maxWidth: 480,
    children: [
      const Text('Digite o código do grupo que você recebeu.'),
      const SizedBox(height: 24),
      AppTextField(
        controller: _code,
        label: 'Código do grupo',
        autofocus: widget.initialCode == null,
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
  );
}

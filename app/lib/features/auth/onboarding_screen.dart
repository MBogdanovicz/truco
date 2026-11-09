import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/auth_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// Asks a new user for the name shown to other players and in rankings.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingState();
}

class _OnboardingState extends ConsumerState<OnboardingScreen> {
  final _name = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final name = _name.text.trim();
    if (name.length < 2) {
      setState(() => _error = 'O nome precisa ter pelo menos 2 letras.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref.read(authRepositoryProvider).setDisplayName(name);
    } on Object {
      if (mounted) setState(() => _error = 'Não foi possível salvar. Tente de novo.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Seu nome',
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Text('Como você quer ser chamado?', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('Esse nome aparece para os outros jogadores e no ranking.'),
          const SizedBox(height: 24),
          AppTextField(
            controller: _name,
            label: 'Nome',
            autofocus: true,
            maxLength: 24,
            textCapitalization: TextCapitalization.words,
            onSubmitted: (_) => _save(),
          ),
          if (_error != null)
            Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
          const SizedBox(height: 24),
          _busy ? const Center(child: AppProgress()) : AppButton(label: 'Continuar', onPressed: _save),
        ],
      ),
    );
  }
}

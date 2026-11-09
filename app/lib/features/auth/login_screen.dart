import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/auth_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// Email + 6-digit code login. The account is created on first sign-in.
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginState();
}

class _LoginState extends ConsumerState<LoginScreen> {
  final _email = TextEditingController();
  final _code = TextEditingController();
  bool _codeSent = false;
  bool _busy = false;
  String? _error;

  static final _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  @override
  void dispose() {
    _email.dispose();
    _code.dispose();
    super.dispose();
  }

  Future<void> _run(Future<void> Function() action) async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await action();
    } on AuthException catch (e) {
      setState(() => _error = _describe(e));
    } on Object {
      setState(
        () => _error = 'Não foi possível conectar. Verifique sua internet.',
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String _describe(AuthException e) {
    final code = e.code ?? '';
    if (code.contains('otp_expired') ||
        e.message.toLowerCase().contains('expired')) {
      return 'Código inválido ou expirado.';
    }
    if (e.statusCode == '429' || code.contains('rate_limit')) {
      return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    }
    if (e.message.toLowerCase().contains('sending')) {
      return 'Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos.';
    }
    debugPrint('Auth error: ${e.code} ${e.statusCode} ${e.message}');
    return 'Não foi possível entrar agora. Tente de novo.';
  }

  Future<void> _sendCode() async {
    if (!_emailPattern.hasMatch(_email.text.trim())) {
      setState(() => _error = 'Digite um e-mail válido.');
      return;
    }
    await _run(() async {
      await ref.read(authRepositoryProvider).sendCode(_email.text);
      setState(() => _codeSent = true);
    });
  }

  Future<void> _verify() async {
    if (_code.text.trim().length < 6) {
      setState(() => _error = 'Digite o código recebido por e-mail.');
      return;
    }
    // On success the router redirects (auth state listener).
    await _run(
      () =>
          ref.read(authRepositoryProvider).verifyCode(_email.text, _code.text),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AppScaffold(
      title: 'Entrar',
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          Text(
            _codeSent ? 'Confira seu e-mail' : 'Bem-vindo ao Truco!',
            style: theme.textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            _codeSent
                ? 'Enviamos um código para ${_email.text.trim()}. Digite-o abaixo.'
                : 'Digite seu e-mail. Vamos enviar um código para você entrar, sem senha.',
          ),
          const SizedBox(height: 24),
          if (!_codeSent)
            AppTextField(
              controller: _email,
              label: 'E-mail',
              keyboardType: TextInputType.emailAddress,
              autofocus: true,
              onSubmitted: (_) => _sendCode(),
            )
          else
            AppTextField(
              controller: _code,
              label: 'Código',
              keyboardType: TextInputType.number,
              autofocus: true,
              maxLength: 8,
              onSubmitted: (_) => _verify(),
            ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: TextStyle(color: theme.colorScheme.error)),
          ],
          const SizedBox(height: 24),
          if (_busy)
            const Center(child: AppProgress())
          else ...[
            AppButton(
              label: _codeSent ? 'Entrar' : 'Enviar código',
              onPressed: _codeSent ? _verify : _sendCode,
            ),
            if (_codeSent) ...[
              const SizedBox(height: 8),
              AppTextButton(label: 'Reenviar código', onPressed: _sendCode),
              AppTextButton(
                label: 'Usar outro e-mail',
                onPressed: () => setState(() {
                  _codeSent = false;
                  _code.clear();
                  _error = null;
                }),
              ),
            ],
          ],
        ],
      ),
    );
  }
}

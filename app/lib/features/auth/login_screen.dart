import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../data/auth_repository.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import '../../ui/android_download_card.dart';

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
    } on Object catch (e) {
      debugPrint('Login failed: $e');
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
        code.contains('invalid_credentials') ||
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
    if (code.contains('anonymous_provider_disabled')) {
      return 'A entrada sem conta ainda não está ativada no servidor.';
    }
    // The code helps us find the cause when someone reports it.
    return 'Não foi possível entrar agora. Tente de novo. '
        '(${e.code ?? e.statusCode ?? 'erro'})';
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

  /// Joining someone's room doesn't need an account; the game just won't
  /// count for the rankings.
  Future<void> _guest() async {
    final name = TextEditingController();
    final ok = await showAppDialog<bool>(
      context,
      title: 'Entrar sem conta',
      content: Padding(
        padding: const EdgeInsets.only(top: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Você pode entrar em salas e marcar os tentos, mas as partidas '
              'não contam para o ranking e não dá para usar grupos.',
            ),
            const SizedBox(height: 12),
            AppTextField(
              controller: name,
              label: 'Seu nome',
              autofocus: true,
              maxLength: 24,
              textCapitalization: TextCapitalization.words,
            ),
          ],
        ),
      ),
      actions: const [
        AppDialogAction(label: 'Cancelar', value: false),
        AppDialogAction(label: 'Entrar', value: true, isPrimary: true),
      ],
    );
    final value = name.text.trim();
    name.dispose();
    if (ok != true) return;
    if (value.length < 2) {
      setState(() => _error = 'O nome precisa ter pelo menos 2 letras.');
      return;
    }
    await _run(() => ref.read(authRepositoryProvider).signInAsGuest(value));
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
      maxWidth: 480,
      children: [
        if (!_codeSent && AndroidDownloadCard.isShown) ...[
          const AndroidDownloadCard(),
          const SizedBox(height: 16),
        ],
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
            key: const ValueKey('email'),
            controller: _email,
            label: 'E-mail',
            keyboardType: TextInputType.emailAddress,
            autofocus: true,
            onSubmitted: (_) => _sendCode(),
          )
        else
          AppTextField(
            // A distinct key makes Flutter build a new field, so the
            // keyboard switches from the e-mail layout to digits.
            key: const ValueKey('code'),
            controller: _code,
            label: 'Código',
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            autofillHints: const [AutofillHints.oneTimeCode],
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
          if (!_codeSent) ...[
            const SizedBox(height: 8),
            AppTextButton(
              label: 'Entrar sem conta, só para marcar',
              onPressed: _guest,
            ),
          ],
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
    );
  }
}

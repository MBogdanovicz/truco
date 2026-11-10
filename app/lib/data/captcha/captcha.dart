import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../config/env.dart';
import '../../ui/adaptive/adaptive_widgets.dart';
import 'turnstile_view.dart';

/// The person closed the security check without finishing it.
class CaptchaCancelled implements Exception {
  const CaptchaCancelled();
}

/// Cloudflare Turnstile check required by Supabase Auth before it sends a
/// code, signs in a guest or checks a password. Each token works once.
class Captcha {
  const Captcha(this.siteKey);

  final String siteKey;

  /// Returns a fresh token, or null when no site key is configured.
  /// Throws [CaptchaCancelled] if the person closes the check.
  Future<String?> solve(BuildContext context) async {
    if (siteKey.isEmpty) return null;
    final token = await showAppDialog<String?>(
      context,
      title: 'Verificação de segurança',
      barrierDismissible: false,
      content: _CaptchaBody(siteKey: siteKey),
      actions: const [AppDialogAction(label: 'Cancelar', value: null)],
    );
    if (token == null || token.isEmpty) throw const CaptchaCancelled();
    return token;
  }
}

class _CaptchaBody extends StatefulWidget {
  const _CaptchaBody({required this.siteKey});

  final String siteKey;

  @override
  State<_CaptchaBody> createState() => _CaptchaBodyState();
}

class _CaptchaBodyState extends State<_CaptchaBody> {
  bool _done = false;
  String? _error;

  void _onToken(String token) {
    if (_done || !mounted) return;
    _done = true;
    Navigator.of(context).pop(token);
  }

  void _onError(String code) {
    debugPrint('Turnstile error: $code');
    if (!mounted || _done) return;
    setState(
      () => _error =
          'Não foi possível fazer a verificação. Confira sua internet e '
          'tente de novo.',
    );
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 12),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          'Só um instante, estamos confirmando que você não é um robô.',
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: 300,
          height: 70,
          child: TurnstileView(
            siteKey: widget.siteKey,
            onToken: _onToken,
            onError: _onError,
          ),
        ),
        if (_error != null) ...[
          const SizedBox(height: 8),
          Text(
            _error!,
            style: TextStyle(color: Theme.of(context).colorScheme.error),
          ),
        ],
      ],
    ),
  );
}

final captchaProvider = Provider<Captcha>(
  (ref) => const Captcha(Env.turnstileSiteKey),
);

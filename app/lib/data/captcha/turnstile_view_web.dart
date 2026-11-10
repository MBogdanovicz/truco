import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

/// Turnstile rendered straight into the PWA page.
class TurnstileView extends StatelessWidget {
  const TurnstileView({
    super.key,
    required this.siteKey,
    required this.onToken,
    required this.onError,
  });

  final String siteKey;
  final ValueChanged<String> onToken;
  final ValueChanged<String> onError;

  @override
  Widget build(BuildContext context) => HtmlElementView.fromTagName(
    tagName: 'div',
    onElementCreated: (element) =>
        unawaited(_render(element as web.HTMLElement)),
  );

  Future<void> _render(web.HTMLElement element) async {
    try {
      await _loadScript();
      // The element is attached to the page right after it is created.
      for (var i = 0; i < 50 && !element.isConnected; i++) {
        await Future<void>.delayed(const Duration(milliseconds: 20));
      }
      final options = JSObject()
        ..['sitekey'] = siteKey.toJS
        ..['language'] = 'pt-br'.toJS
        ..['callback'] = ((JSString t) => onToken(t.toDart)).toJS
        ..['error-callback'] = ((JSAny? e) => onError('error:$e')).toJS
        ..['expired-callback'] = (() => onError('error:expired')).toJS;
      (globalContext['turnstile']! as JSObject).callMethod<JSAny?>(
        'render'.toJS,
        element,
        options,
      );
    } on Object catch (e) {
      onError('error:$e');
    }
  }
}

Future<void>? _loading;

Future<void> _loadScript() => _loading ??= () async {
  if (globalContext.has('turnstile')) return;
  final script = web.HTMLScriptElement()
    ..src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    ..async = true;
  web.document.head!.appendChild(script);
  for (var i = 0; i < 300; i++) {
    if (globalContext.has('turnstile')) return;
    await Future<void>.delayed(const Duration(milliseconds: 50));
  }
  _loading = null;
  throw TimeoutException('Turnstile script did not load');
}();

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../config/env.dart';

/// Turnstile in a small WebView. The page is served as if it came from the
/// PWA's domain, which is the hostname registered for the widget.
class TurnstileView extends StatefulWidget {
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
  State<TurnstileView> createState() => _TurnstileViewState();
}

class _TurnstileViewState extends State<TurnstileView> {
  late final WebViewController _controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..setBackgroundColor(Colors.transparent)
    ..addJavaScriptChannel(
      'TrucoCaptcha',
      onMessageReceived: (m) {
        final msg = m.message;
        if (msg.startsWith('token:')) {
          widget.onToken(msg.substring(6));
        } else {
          widget.onError(msg);
        }
      },
    )
    ..loadHtmlString(_html(widget.siteKey), baseUrl: '${Env.webAppUrl}/');

  @override
  Widget build(BuildContext context) => WebViewWidget(controller: _controller);
}

String _html(String siteKey) =>
    '''
<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;background:transparent;display:flex;justify-content:center}</style>
<script>
function trucoReady() {
  turnstile.render('#w', {
    sitekey: ${jsonEncode(siteKey)},
    language: 'pt-br',
    callback: function (t) { TrucoCaptcha.postMessage('token:' + t); },
    'error-callback': function (e) { TrucoCaptcha.postMessage('error:' + e); },
    'expired-callback': function () { TrucoCaptcha.postMessage('error:expired'); }
  });
}
</script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=trucoReady&render=explicit" async defer></script>
</head><body><div id="w"></div></body></html>
''';

import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:web/web.dart' as web;

/// How this browser can install the site as an app.
enum PwaInstall { none, iosShare, prompt }

/// [PwaInstall.iosShare] on an iPhone or iPad not running the installed
/// app; [PwaInstall.prompt] when the browser offered its install prompt
/// (kept by index.html as `trucoInstallPrompt`); otherwise none.
PwaInstall get pwaInstall {
  try {
    final w = web.window;
    final standalone =
        w.matchMedia('(display-mode: standalone)').matches ||
        (w.navigator as JSObject).getProperty<JSAny?>('standalone'.toJS) ==
            true.toJS;
    if (standalone) return PwaInstall.none;
    final ua = w.navigator.userAgent;
    if (RegExp('Android').hasMatch(ua)) return PwaInstall.none;
    final ios =
        RegExp('iPhone|iPad|iPod').hasMatch(ua) ||
        (w.navigator.platform == 'MacIntel' && w.navigator.maxTouchPoints > 1);
    if (ios) return PwaInstall.iosShare;
    if ((w as JSObject).has('trucoInstallPrompt')) return PwaInstall.prompt;
  } on Object {
    // Unknown browser: offer nothing.
  }
  return PwaInstall.none;
}

/// Shows the browser's install prompt; true if the person accepted.
Future<bool> promptPwaInstall() async {
  try {
    final w = web.window as JSObject;
    final event = w.getProperty<JSObject?>('trucoInstallPrompt'.toJS);
    if (event == null) return false;
    event.callMethod<JSAny?>('prompt'.toJS);
    final choice = await event
        .getProperty<JSPromise<JSObject>>('userChoice'.toJS)
        .toDart;
    final accepted =
        choice.getProperty<JSString?>('outcome'.toJS)?.toDart == 'accepted';
    if (accepted) w.delete('trucoInstallPrompt'.toJS);
    return accepted;
  } on Object {
    return false;
  }
}

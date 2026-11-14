// Installing the website as an app (PWA): iPhone/iPad instructions or the
// browser's own install prompt. Nothing on Android (it has the Play app)
// or outside the web.
export 'pwa_install_io.dart'
    if (dart.library.js_interop) 'pwa_install_web.dart';

// Whether the PWA runs in Brave (it exposes `navigator.brave`).
export 'is_brave_io.dart' if (dart.library.js_interop) 'is_brave_web.dart';

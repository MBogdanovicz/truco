{{flutter_js}}
{{flutter_build_config}}

// No service worker: Flutter's is deprecated, and an old one kept serving
// stale builds. Cache busting is done by versioned URLs (see pwa.yml).
_flutter.loader.load();

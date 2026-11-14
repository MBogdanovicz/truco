/// How this browser can install the site as an app.
enum PwaInstall { none, iosShare, prompt }

PwaInstall get pwaInstall => PwaInstall.none;

Future<bool> promptPwaInstall() async => false;

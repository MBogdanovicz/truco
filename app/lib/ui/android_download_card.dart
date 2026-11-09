import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config/env.dart';
import 'adaptive/adaptive_widgets.dart';
import 'theme/app_theme.dart';

/// On the website opened from an Android phone, offers the native app (it
/// also has the offline "nearby" mode). Renders nothing elsewhere.
class AndroidDownloadCard extends StatelessWidget {
  const AndroidDownloadCard({super.key});

  static bool get isShown =>
      kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  static const subtitle =
      'Funciona melhor e marca partidas até sem internet. '
      'Depois de baixar, abra o arquivo para instalar.';

  static void open() => launchUrl(
    Uri.parse(Env.androidApkUrl),
    mode: LaunchMode.externalApplication,
  );

  @override
  Widget build(BuildContext context) {
    if (!isShown) return const SizedBox.shrink();
    return const AppSection(
      children: [
        AppTile(
          leading: AppTileIcon(AppIcon.download, color: AppColors.felt),
          title: 'Baixe o app para Android',
          subtitle: subtitle,
          onTap: open,
        ),
      ],
    );
  }
}

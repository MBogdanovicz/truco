import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config/env.dart';
import 'theme/app_theme.dart';

/// On the website opened from an Android phone, offers the native app (it
/// also has the offline "nearby" mode). Renders nothing elsewhere.
class AndroidDownloadCard extends StatelessWidget {
  const AndroidDownloadCard({super.key});

  static bool get isShown =>
      kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  @override
  Widget build(BuildContext context) {
    if (!isShown) return const SizedBox.shrink();
    return Card(
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: const CircleAvatar(
          backgroundColor: AppColors.felt,
          child: Icon(Icons.android, color: Colors.white),
        ),
        title: const Text('Baixe o app para Android'),
        subtitle: const Text(
          'Funciona melhor e marca partidas até sem internet. '
          'Depois de baixar, abra o arquivo para instalar.',
        ),
        trailing: const Icon(Icons.download),
        onTap: () => launchUrl(
          Uri.parse(Env.androidApkUrl),
          mode: LaunchMode.externalApplication,
        ),
      ),
    );
  }
}

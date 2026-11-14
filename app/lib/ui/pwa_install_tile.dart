import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'adaptive/adaptive_widgets.dart';
import 'browser/pwa_install.dart';

/// "Instalar o app" on the website (iPhone, iPad and browsers that offer
/// installing), so the PWA lives on the home screen like an app.
abstract final class PwaInstallTile {
  static bool get isShown => pwaInstall != PwaInstall.none;

  static const title = 'Instalar o app';
  static const subtitle =
      'Fica na tela de início, abre em tela cheia e recebe as intimações.';

  static Future<void> open(BuildContext context) async {
    if (pwaInstall == PwaInstall.prompt) {
      await promptPwaInstall();
      return;
    }
    await showAppDialog<void>(
      context,
      title: 'Instalar no iPhone',
      content: const _IosSteps(),
      actions: const [
        AppDialogAction(label: 'Entendi', value: null, isPrimary: true),
      ],
    );
  }
}

class _IosSteps extends StatelessWidget {
  const _IosSteps();

  @override
  Widget build(BuildContext context) {
    Widget step(String n, InlineSpan text) => Padding(
      padding: const EdgeInsets.only(top: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 22, child: Text('$n.')),
          Expanded(child: Text.rich(text, textAlign: TextAlign.start)),
        ],
      ),
    );
    const share = WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: Icon(CupertinoIcons.share, size: 18),
    );
    const add = WidgetSpan(
      alignment: PlaceholderAlignment.middle,
      child: Icon(CupertinoIcons.plus_app, size: 18),
    );
    const bold = TextStyle(fontWeight: FontWeight.w600);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        step(
          '1',
          const TextSpan(
            children: [
              TextSpan(text: 'Toque em '),
              TextSpan(text: 'Compartilhar ', style: bold),
              share,
              TextSpan(
                text:
                    ' (na barra de baixo no Safari, ou ao lado do '
                    'endereço).',
              ),
            ],
          ),
        ),
        step(
          '2',
          const TextSpan(
            children: [
              TextSpan(text: 'Role a lista e toque em '),
              TextSpan(text: 'Adicionar à Tela de Início ', style: bold),
              add,
              TextSpan(text: '.'),
            ],
          ),
        ),
        step(
          '3',
          const TextSpan(
            children: [
              TextSpan(text: 'Toque em '),
              TextSpan(text: 'Adicionar', style: bold),
              TextSpan(text: '. Depois abra o Truco! pelo ícone.'),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Abriu o link dentro do WhatsApp ou do Instagram? Abra no Safari '
          'primeiro.',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';

import '../../domain/game/rules.dart';
import '../../ui/adaptive/adaptive_widgets.dart';

/// "Regras do jogo": how to play each variant.
class RulesScreen extends StatefulWidget {
  const RulesScreen({super.key, this.fixedManilhas = false});

  final bool fixedManilhas;

  @override
  State<RulesScreen> createState() => _RulesScreenState();
}

class _RulesScreenState extends State<RulesScreen> {
  late bool _fixed = widget.fixedManilhas;

  @override
  Widget build(BuildContext context) {
    final r = TrucoRules.paulista.copyWith(
      manilhaMode: _fixed ? ManilhaMode.fixed : ManilhaMode.vira,
    );
    final virada = !_fixed;
    final raises = [
      for (var i = 1; i < r.stakes.length; i++)
        '${r.raiseName(i - 1)} (${r.stakes[i]})',
    ].join(', ');
    final sections = <(String, List<String>)>[
      (
        'O jogo',
        [
          'Quatro jogadores em duas duplas; o parceiro senta à sua frente. '
              'Ganha a dupla que chegar a ${r.targetScore} pontos (tentos).',
          'Usa-se o baralho sem 8, 9 e 10 (40 cartas). Cada jogador recebe '
              '3 cartas e a mão é disputada em até 3 rodadas (vazas). '
              'Quem ganhar 2 rodadas leva a mão.',
          'O jogo anda no sentido anti-horário: começa quem está à direita '
              'de quem deu as cartas.',
          'O "pé" é quem joga por último na rodada. Na primeira é quem deu '
              'as cartas; depois, é quem está à esquerda de quem ganhou a '
              'rodada anterior (quem ganha começa a próxima). Na mesa, o pé '
              'tem a marca PÉ.',
        ],
      ),
      (
        'Força das cartas',
        [
          'Da mais fraca para a mais forte: 4, 5, 6, 7, Q (dama), J (valete), '
              'K (rei), A (ás), 2, 3. O naipe não importa, exceto nas manilhas.',
          if (virada)
            'Manilhas: depois de dar as cartas, vira-se uma carta (a "vira"). '
                'As manilhas são as cartas logo acima dela (vira 7, manilha é '
                'a dama; vira 3, manilha é o 4). Entre manilhas vale o naipe: '
                'paus (zap) > copas > espadas > ouros (pica-fumo).'
          else
            'Manilhas fixas, da mais forte para a mais fraca: 4 de paus '
                '(zap), 7 de copas (copas), ás de espadas (espadilha) e 7 de '
                'ouros (pica-fumo), como no truco mineiro. Não tem vira.',
          'No app as manilhas têm uma estrelinha e borda dourada.',
        ],
      ),
      (
        'Rodadas e empates',
        [
          'Em cada rodada vence a carta mais forte. Se as cartas mais fortes '
              'das duas duplas forem iguais, a rodada empata ("cangou").',
          'Empatou a primeira: quem ganhar a segunda leva a mão. Ganhou a '
              'primeira e empatou a segunda (ou a terceira): leva quem ganhou '
              'a primeira. Empatou tudo: ninguém marca.',
          'Opcional: da segunda rodada em diante você pode jogar uma carta coberta '
              '(virada para baixo). Ela não vale nada, mas esconde a carta.',
        ],
      ),
      (
        'Truco',
        [
          'A mão vale ${r.baseValue}. Na sua vez, antes de jogar, você pode '
              'pedir truco. Os adversários aceitam, correm ou aumentam.',
          'Sequência: $raises.',
          'Se correrem, quem pediu leva o valor que a mão tinha antes do '
              'pedido. Quem aceitou um pedido pode aumentar depois, na sua vez; '
              'quem pediu, não.',
          'Opcional: quem responde ao truco pode ver as cartas do parceiro '
              'antes de decidir.',
        ],
      ),
      (
        'Mão de onze',
        [
          'Quando uma dupla chega a ${r.decisionScore} pontos, os dois '
              'parceiros veem as cartas um do outro e decidem se jogam a mão. '
              'Jogando, ela vale ${r.decisionHandValue}; correndo, os '
              'adversários levam ${r.baseValue}. Ninguém pode pedir truco.',
          'Opcional: os adversários também veem as cartas do parceiro.',
          'Mão de ferro (opcional): se as duas duplas estiverem com '
              '${r.decisionScore}, todos jogam sem ver as próprias cartas, e '
              'a mão vale ${r.baseValue}.',
        ],
      ),
      (
        'Quem dá as cartas',
        [
          'Opcional: quem dá as cartas pode ver a terceira carta que entrega '
              'ao parceiro.',
        ],
      ),
    ];
    final theme = Theme.of(context);
    return AppScaffold(
      title: 'Regras do truco paulista',
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: AppSegmented<bool>(
            segments: const {false: 'Manilha virada', true: 'Manilhas fixas'},
            value: _fixed,
            onChanged: (v) => setState(() => _fixed = v),
          ),
        ),
        for (final (title, items) in sections)
          AppSection(
            header: title,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final t in items)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Text(t, style: theme.textTheme.bodyMedium),
                      ),
                  ],
                ),
              ),
            ],
          ),
      ],
    );
  }
}

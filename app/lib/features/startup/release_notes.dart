/// What's new, shown once after an update. Add a note with the next [id]
/// for every release that has something users should know about.
class ReleaseNote {
  const ReleaseNote(this.id, this.items, {this.appOnly = const []});

  final int id;
  final List<String> items;

  /// Shown only in the Android app, never on the site (e.g. ads, which the
  /// site doesn't have).
  final List<String> appOnly;
}

const releaseNotes = <ReleaseNote>[
  ReleaseNote(1, [
    'O app avisa quando tem uma versão nova na Play Store.',
    'A tela do Premium mostra o e-mail em que a compra fica.',
    'Com a mesma conta do Google, dá para comprar o Premium para mais de '
        'um e-mail.',
  ]),
  ReleaseNote(2, [
    'Conquistas! Ganhe nas partidas rankeadas e veja no Google Play Games.',
    'Ranking em tabela, com os 12 x 0 aplicados e tomados.',
    'Doze a zero no fim da partida: quem perde passa por baixo da mesa!',
    'O link de convite de sala ou grupo abre direto no app.',
    'Escolha de grupo com busca e verificação de segurança no login.',
  ]),
  ReleaseNote(3, [
    'Conquistas no Google Play Games sem avisos repetidos, só na conta do '
        'Google ligada à sua conta do app.',
    'Ranking com o saldo médio de pontos por partida.',
    'Aviso claro ao tentar entrar na própria sala com a mesma conta em '
        'outro aparelho.',
  ]),
  ReleaseNote(
    4,
    [],
    appOnly: [
      'A versão grátis agora mostra um anúncio antes das partidas. Com o '
          'Premium, nenhum anúncio.',
    ],
  ),
  ReleaseNote(5, [
    'Novo: jogue truco paulista contra o computador! Escolha o nível do '
        'parceiro e dos adversários (fácil, médio ou difícil).',
    'Variações de regra: manilha virada ou fixa, carta coberta, mão de '
        'ferro, ver as cartas do parceiro ao receber truco ou na mão de onze, '
        'e quem dá ver a 3ª carta do parceiro.',
    'Tela com as regras do truco.',
  ]),
];

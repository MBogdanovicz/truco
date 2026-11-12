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
    'Novo: jogue truco contra o computador! Escolha o nível do '
        'parceiro e dos adversários (fácil, médio ou difícil).',
    'Variações de regra: manilha virada ou fixa, carta coberta, mão de '
        'ferro, ver as cartas do parceiro ao receber truco ou na mão de onze, '
        'e quem dá ver a 3ª carta do parceiro.',
    'Tela com as regras do truco.',
  ]),
  ReleaseNote(6, [
    'Novo: truco online! Crie uma sala em "Jogar truco" e chame os amigos '
        'pelo código ou link. O computador joga nos lugares vazios.',
    'Partidas online com 4 pessoas com conta contam para o ranking.',
    'Ranking com filtro: Jogo, Marcador ou Ambos.',
  ]),
  ReleaseNote(7, [
    'Novo: intime o seu grupo! Na sala, toque em "Intimar o grupo" e todos '
        'com os avisos ligados recebem um chamado para jogar.',
    'Ligue os avisos em Grupos > "Receber intimações".',
    '14 conquistas novas do jogo de truco, algumas secretas.',
  ]),
  ReleaseNote(8, [
    'Novo (Premium): modo professor! Contra o computador, ele comenta as '
        'suas jogadas, ajuda a pensar nas decisões difíceis e faz um resumo '
        'no fim da partida.',
    'Novo (Premium): Treinar, com situações de jogo e a explicação da '
        'melhor jogada.',
    'Tempo de jogada nas salas online: 10, 20 ou 30 segundos, ou sem limite.',
    'Computador mais esperto: joga em dupla com o parceiro e sabe segurar '
        'o truco.',
    'Marcador e jogo contra o computador funcionam sem internet.',
  ]),
  ReleaseNote(9, [
    'Novo: torneios! Mata-mata, repescagem ou todos contra todos, públicos '
        'ou do grupo, com inscrição por dupla ou individual. Criar é Premium; '
        'participar é grátis.',
    'Novo: partida lenta, para 4 pessoas jogarem sem combinar horário, com '
        'dias para cada jogada e aviso na sua vez.',
    'Ao receber truco, se o primeiro correr, o parceiro decide.',
    'A carta coberta aparece para o parceiro.',
    'Num jogo de torneio, quem sai da mesa (ou deixa o tempo acabar 3 '
        'vezes seguidas) entrega o jogo por W.O.',
    'Se a rodada embuchar, o pé continua o mesmo.',
    'Dá para assistir um jogo pelo código da sala e sentar à mesa quando '
        'alguém sai. Na sala, dá para levantar e sentar num lugar vago, e ver o '
        'código durante o jogo.',
  ]),
  ReleaseNote(10, [
    'Nova tela de Configurações (engrenagem na tela inicial): suas regras '
        'preferidas, o visual do placar e as notificações.',
    'Escolha como você chama as manilhas e a rodada empatada (embuchar, '
        'cangar, melar...). Só você vê.',
    'Ao criar um jogo ou torneio, as regras aparecem resumidas, com um '
        'botão para mudar só naquela partida.',
    'Os torneios encerrados agora ficam no Histórico.',
    'O Treinar agora fica na tela inicial.',
    'Mesa nova: a vira fica no meio, com o baralho por cima, e logo abaixo '
        'quanto a mão vale.',
    'Truco! Sofá de zona! Um grito no começo de cada partida.',
  ]),
];

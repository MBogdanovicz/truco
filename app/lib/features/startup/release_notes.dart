/// What's new, shown once after an update. Add a note with the next [id]
/// for every release that has something users should know about.
class ReleaseNote {
  const ReleaseNote(this.id, this.items);

  final int id;
  final List<String> items;
}

const releaseNotes = <ReleaseNote>[
  ReleaseNote(1, [
    'O app avisa quando tem uma versão nova na Play Store.',
    'A tela do Premium mostra o e-mail em que a compra fica.',
    'Com a mesma conta do Google, dá para comprar o Premium para mais de '
        'um e-mail.',
  ]),
];

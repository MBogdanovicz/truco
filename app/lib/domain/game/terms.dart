/// Words each player picks for the manilhas and the tied round, shown only
/// on their own screen. App texts are written with the defaults (gato,
/// copas, espadilha, salmoura, embuchar) and [Terms.apply] swaps them.
library;

/// A name and its gender (for the article: "o gato", "a espadilha").
class TermName {
  const TermName(this.name, {this.feminine = false});
  final String name;
  final bool feminine;

  Map<String, Object> toJson() => {'n': name, 'f': feminine};

  static TermName? fromJson(Object? j) {
    if (j is! Map) return null;
    final n = (j['n'] as String?)?.trim();
    if (n == null || n.isEmpty) return null;
    return TermName(n, feminine: j['f'] == true);
  }

  @override
  bool operator ==(Object other) =>
      other is TermName && other.name == name && other.feminine == feminine;

  @override
  int get hashCode => Object.hash(name, feminine);
}

/// The four manilhas, strongest first.
enum ManilhaSlot {
  paus('Paus (a maior)', TermName('gato'), [TermName('gato'), TermName('zap')]),
  copas('Copas', TermName('copas', feminine: true), [
    TermName('copas', feminine: true),
    TermName('copão'),
    TermName('sete copas'),
  ]),
  espadas('Espadas', TermName('espadilha', feminine: true), [
    TermName('espadilha', feminine: true),
    TermName('espadão'),
    TermName('espada', feminine: true),
  ]),
  ouros('Ouros (a menor)', TermName('salmoura', feminine: true), [
    TermName('salmoura', feminine: true),
    TermName('pica-fumo'),
    TermName('sete belo'),
  ]);

  const ManilhaSlot(this.label, this.byDefault, this.common);
  final String label;
  final TermName byDefault;
  final List<TermName> common;
}

/// The verb for a tied round. Regular -ar verbs, so the app's forms
/// (embucha, embuchou, embuchada, embuchar) keep their endings.
enum TieVerb {
  embuchar('embuch'),
  cangar('cang'),
  empatar('empat'),
  melar('mel');

  const TieVerb(this.stem);
  final String stem;
}

class Terms {
  const Terms({this.manilhas = const {}, this.tie = TieVerb.embuchar});

  /// Only the slots the player changed.
  final Map<ManilhaSlot, TermName> manilhas;
  final TieVerb tie;

  static const standard = Terms();

  TermName nameOf(ManilhaSlot s) => manilhas[s] ?? s.byDefault;

  Terms withManilha(ManilhaSlot s, TermName name) => Terms(
    manilhas: {
      for (final e in manilhas.entries)
        if (e.key != s) e.key: e.value,
      if (name != s.byDefault) s: name,
    },
    tie: tie,
  );

  Terms withTie(TieVerb verb) => Terms(manilhas: manilhas, tie: verb);

  bool get isStandard => manilhas.isEmpty && tie == TieVerb.embuchar;

  Map<String, Object> toJson() => {
    for (final e in manilhas.entries) e.key.name: e.value.toJson(),
    'tie': tie.name,
  };

  static Terms fromJson(Map<String, Object?> j) => Terms(
    manilhas: {
      for (final s in ManilhaSlot.values) s: ?TermName.fromJson(j[s.name]),
    },
    tie: TieVerb.values.asNameMap()[j['tie']] ?? TieVerb.embuchar,
  );

  static const _articles = {
    // masculine: feminine
    'o': 'a', 'do': 'da', 'no': 'na', 'ao': 'à', 'pelo': 'pela',
  };

  /// [text] with the player's words in place of the defaults.
  String apply(String text) {
    if (isStandard) return text;
    var out = text;
    for (final s in ManilhaSlot.values) {
      final to = manilhas[s];
      if (to == null) continue;
      out = _swap(out, s.byDefault, to, needsArticle: s == ManilhaSlot.copas);
    }
    if (tie != TieVerb.embuchar) {
      out = out.replaceAllMapped(
        RegExp('([Ee])mbuch'),
        (m) => m[1] == 'E' ? _cap(tie.stem) : tie.stem,
      );
    }
    return out;
  }

  /// Replaces [from] (with its article, if any) by [to]. "copas" is also a
  /// suit, so it only changes when it reads as the manilha: after an
  /// article ("a copas") or in parentheses ("(copas)").
  static String _swap(
    String text,
    TermName from,
    TermName to, {
    bool needsArticle = false,
  }) {
    const letter = r'[\wÀ-ÿ]';
    final arts = [..._articles.keys, ..._articles.values].join('|');
    final re = RegExp(
      '(?:(?<!$letter)($arts)(\\s+)|(\\())?'
      '(?<!$letter)(${RegExp.escape(from.name)})(?!$letter)',
      caseSensitive: false,
    );
    return text.replaceAllMapped(re, (m) {
      final art = m[1], space = m[2], paren = m[3], word = m[4]!;
      if (needsArticle && art == null && paren == null) return m[0]!;
      final name = _likeCase(word, to.name);
      if (art != null) return '${_article(art, to.feminine)}$space$name';
      return '${paren ?? ''}$name';
    });
  }

  static String _article(String art, bool feminine) {
    final lower = art.toLowerCase();
    final masc = _articles.containsKey(lower)
        ? lower
        : _articles.entries.firstWhere((e) => e.value == lower).key;
    return _likeCase(art, feminine ? _articles[masc]! : masc);
  }

  static String _likeCase(String like, String s) =>
      like[0] == like[0].toUpperCase() && like[0] != like[0].toLowerCase()
      ? _cap(s)
      : s;

  static String _cap(String s) => s[0].toUpperCase() + s.substring(1);
}

/// The two sides of a truco match.
enum Team {
  a,
  b;

  Team get other => this == Team.a ? Team.b : Team.a;

  static Team fromName(String name) => Team.values.byName(name);
}

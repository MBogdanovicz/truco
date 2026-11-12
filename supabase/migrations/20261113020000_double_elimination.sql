-- Tournaments: "repescagem" (double elimination). Each match knows its
-- bracket (winners, losers, final) and where its teams come from (the
-- winner or loser of earlier matches). Safe to run more than once.

alter table public.tournaments drop constraint if exists tournaments_format_check;
alter table public.tournaments add constraint tournaments_format_check
  check (format in ('knockout', 'round_robin', 'double_elimination'));

alter table public.tournament_matches
  add column if not exists bracket text check (bracket in ('winners', 'losers', 'final')),
  add column if not exists sources jsonb;

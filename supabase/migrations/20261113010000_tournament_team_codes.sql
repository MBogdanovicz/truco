-- Tournaments: a pair's partner joins with the pair's code (only the person
-- who signed the pair up can read it), so nobody else takes the place.
-- Safe to run more than once.

create table if not exists public.tournament_team_codes (
  team_id uuid primary key references public.tournament_teams (id) on delete cascade,
  code text not null check (code ~ '^[A-Z0-9]{4}$')
);

alter table public.tournament_team_codes enable row level security;

drop policy if exists "own pair code" on public.tournament_team_codes;
create policy "own pair code" on public.tournament_team_codes
  for select to authenticated
  using (exists (
    select 1 from public.tournament_teams t
    where t.id = team_id and t.player_a = auth.uid()
  ));

revoke insert, update, delete on public.tournament_team_codes from anon, authenticated;

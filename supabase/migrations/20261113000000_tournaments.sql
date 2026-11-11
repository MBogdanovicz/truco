-- Tournaments (G6): public or group-only, knockout or round robin, played
-- in game rooms the server opens for each match (live with a deadline per
-- round, or as slow games).
--
-- The "game" Edge Function is the only writer (service role); the app
-- reads these tables. Registration: fixed pairs, people alone (the draw
-- pairs them), or both. Safe to run more than once, and safe for the app
-- version on main (it never reads these tables).

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  code text not null check (code ~ '^[A-Z0-9]{6}$'),
  name text not null check (char_length(trim(name)) between 3 and 40),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  -- Null: public. Otherwise only that group's members see it and sign up.
  group_id uuid references public.groups (id) on delete cascade,
  format text not null check (format in ('knockout', 'round_robin')),
  entry text not null check (entry in ('pairs', 'solo', 'both')),
  -- Table rules of every match (as game_rooms.rules; "lento" = slow games).
  rules jsonb not null default '{}',
  -- Days to play each round (live matches; slow games have days per move).
  round_days smallint not null default 2 check (round_days between 1 and 14),
  max_teams smallint not null check (max_teams between 3 and 32),
  -- Games per match (1, 3 or 5: first to win 1, 2 or 3), and for the
  -- knockout final.
  best_of smallint not null default 1 check (best_of in (1, 3, 5)),
  final_best_of smallint not null default 1 check (final_best_of in (1, 3, 5)),
  status text not null default 'open'
    check (status in ('open', 'running', 'finished', 'cancelled')),
  champion uuid,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create unique index if not exists tournaments_code on public.tournaments (code);
create index if not exists tournaments_group on public.tournaments (group_id);

create table if not exists public.tournament_teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  player_a uuid not null references public.profiles (id) on delete cascade,
  name_a text not null default '',
  -- Null while the partner hasn't joined (or for someone alone).
  player_b uuid references public.profiles (id) on delete set null,
  name_b text not null default '',
  -- Signed up alone: the draw finds the partner.
  solo boolean not null default false,
  -- Order in the draw (set when the tournament starts).
  seed smallint,
  created_at timestamptz not null default now()
);

create index if not exists tournament_teams_t on public.tournament_teams (tournament_id);
create index if not exists tournament_teams_a on public.tournament_teams (player_a);
create index if not exists tournament_teams_b on public.tournament_teams (player_b);

create table if not exists public.tournament_matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  round smallint not null,
  slot smallint not null,
  team_a uuid references public.tournament_teams (id) on delete set null,
  -- Null: a bye (team_a goes through).
  team_b uuid references public.tournament_teams (id) on delete set null,
  room_id uuid references public.game_rooms (id) on delete set null,
  room_code text,
  -- Play by then (live matches), or it's decided by walkover.
  deadline timestamptz,
  status text not null default 'pending' check (status in ('pending', 'playing', 'done')),
  -- Null when done means both lost (round robin walkover).
  winner uuid references public.tournament_teams (id) on delete set null,
  -- Games won in the series, and tentos made in all of its games.
  games_a smallint not null default 0,
  games_b smallint not null default 0,
  score_a smallint,
  score_b smallint,
  best_of smallint not null default 1,
  walkover boolean not null default false,
  -- Who entered the room (for walkovers).
  present uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (tournament_id, round, slot)
);

create index if not exists tournament_matches_deadline on public.tournament_matches (deadline)
  where status = 'pending';

alter table public.game_rooms
  add column if not exists tournament_match_id uuid
    references public.tournament_matches (id) on delete set null;

alter table public.tournaments enable row level security;
alter table public.tournament_teams enable row level security;
alter table public.tournament_matches enable row level security;

create or replace function public.can_see_tournament(p_tournament uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.tournaments t
    where t.id = p_tournament
      and (t.group_id is null or t.owner_id = auth.uid()
           or public.is_group_member(t.group_id, auth.uid()))
  );
$$;

drop policy if exists "visible tournaments" on public.tournaments;
create policy "visible tournaments" on public.tournaments
  for select to authenticated
  using (group_id is null or owner_id = auth.uid() or public.is_group_member(group_id, auth.uid()));

drop policy if exists "teams of visible tournaments" on public.tournament_teams;
create policy "teams of visible tournaments" on public.tournament_teams
  for select to authenticated using (public.can_see_tournament(tournament_id));

drop policy if exists "matches of visible tournaments" on public.tournament_matches;
create policy "matches of visible tournaments" on public.tournament_matches
  for select to authenticated using (public.can_see_tournament(tournament_id));

revoke insert, update, delete on public.tournaments, public.tournament_teams,
  public.tournament_matches from anon, authenticated;

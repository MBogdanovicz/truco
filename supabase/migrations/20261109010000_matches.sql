-- M3: online rooms and finished scorekeeper matches.

-- Never let a bad name in the signup metadata block account creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if v_name is not null and char_length(v_name) not between 2 and 24 then
    v_name := null;
  end if;
  insert into public.profiles (id, display_name)
  values (new.id, v_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

create type public.team as enum ('a', 'b');
create type public.match_transport as enum ('online', 'nearby', 'single_device');
create type public.match_mode as enum ('ranked', 'friendly');

-- A room is a table of players that may play several games (rematches).
-- Its live state travels over a Realtime broadcast channel ("room:<id>");
-- the database only stores the join code and the finished games.
create table public.rooms (
  id uuid primary key,
  code text not null check (code ~ '^[A-Z0-9]{6}$'),
  host_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create unique index rooms_open_code on public.rooms (code) where closed_at is null;

alter table public.rooms enable row level security;

create policy "rooms are readable by signed-in users"
  on public.rooms for select to authenticated using (true);

create policy "users open their own rooms"
  on public.rooms for insert to authenticated with check (host_id = auth.uid());

create policy "hosts close their rooms"
  on public.rooms for update to authenticated
  using (host_id = auth.uid()) with check (host_id = auth.uid());

revoke update on public.rooms from anon, authenticated;
grant update (closed_at) on public.rooms to authenticated;

create table public.matches (
  id uuid primary key,
  room_id uuid references public.rooms (id) on delete set null,
  host_id uuid not null references public.profiles (id) on delete cascade,
  transport public.match_transport not null,
  mode public.match_mode not null default 'ranked',
  target_score smallint not null default 12,
  score_a smallint not null,
  score_b smallint not null,
  winner public.team not null,
  team_name_a text not null,
  team_name_b text not null,
  is_ranked boolean not null,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index matches_finished_at on public.matches (finished_at desc);

create table public.match_players (
  match_id uuid not null references public.matches (id) on delete cascade,
  seat smallint not null check (seat between 0 and 3),
  team public.team not null,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null default '',
  primary key (match_id, seat)
);

create index match_players_user on public.match_players (user_id);

create table public.match_events (
  match_id uuid not null references public.matches (id) on delete cascade,
  seq int not null,
  kind text not null check (kind in ('score', 'undo')),
  team public.team not null,
  delta smallint not null default 0,
  author_seat smallint not null,
  undoes_seq int,
  client_ts timestamptz not null,
  primary key (match_id, seq)
);

alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.match_events enable row level security;

-- Results feed public rankings, so they are readable by signed-in users.
create policy "matches are readable" on public.matches for select to authenticated using (true);
create policy "match players are readable" on public.match_players for select to authenticated using (true);
create policy "match events are readable" on public.match_events for select to authenticated using (true);
-- No insert/update policies: results are written only by finish_match().

-- Saves a finished game sent by its host. Idempotent on the match id.
-- The score is recomputed from the event log; the client's totals are not trusted.
create function public.finish_match(
  p_record jsonb,
  p_transport public.match_transport,
  p_room_id uuid default null,
  p_mode public.match_mode default 'ranked'
)
returns public.matches
language plpgsql
security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid := (p_record ->> 'id')::uuid;
  v_match public.matches;
  v_target int := 12;
  v_score_a int;
  v_score_b int;
  v_winner public.team;
  v_ranked boolean;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_match from public.matches where id = v_id;
  if found then
    return v_match;
  end if;

  if not exists (
    select 1 from jsonb_array_elements(p_record -> 'seats') s
    where (s ->> 'userId')::uuid = v_uid
  ) and p_transport <> 'single_device' then
    raise exception 'only a seated player can save the match';
  end if;

  -- Score = sum of score events that were not undone, capped at the target.
  with ev as (
    select e ->> 'kind' as kind, (e ->> 'team')::public.team as team,
           coalesce((e ->> 'delta')::int, 0) as delta, (e ->> 'seq')::int as seq,
           (e ->> 'undoesSeq')::int as undoes
    from jsonb_array_elements(p_record -> 'events') e
  )
  select
    least(v_target, coalesce(sum(delta) filter (where team = 'a'), 0)),
    least(v_target, coalesce(sum(delta) filter (where team = 'b'), 0))
  into v_score_a, v_score_b
  from ev
  where kind = 'score' and seq not in (select undoes from ev where kind = 'undo' and undoes is not null);

  if v_score_a = v_target and v_score_b < v_target then
    v_winner := 'a';
  elsif v_score_b = v_target and v_score_a < v_target then
    v_winner := 'b';
  else
    raise exception 'match is not finished (% x %)', v_score_a, v_score_b;
  end if;

  -- Ranked only for 2v2 games where every seat is a distinct registered user.
  select p_mode = 'ranked'
         and count(*) = 4
         and count(distinct (s ->> 'userId')) = 4
         and count(*) filter (where s ->> 'team' = 'a') = 2
  into v_ranked
  from jsonb_array_elements(p_record -> 'seats') s
  where s ->> 'userId' is not null;

  insert into public.matches (
    id, room_id, host_id, transport, mode, target_score, score_a, score_b, winner,
    team_name_a, team_name_b, is_ranked, started_at, finished_at
  ) values (
    v_id, p_room_id, v_uid, p_transport, p_mode, v_target, v_score_a, v_score_b, v_winner,
    left(coalesce(p_record -> 'teamNames' ->> 'a', 'Nós'), 20),
    left(coalesce(p_record -> 'teamNames' ->> 'b', 'Eles'), 20),
    coalesce(v_ranked, false),
    (p_record ->> 'startedAt')::timestamptz,
    (p_record ->> 'finishedAt')::timestamptz
  )
  returning * into v_match;

  insert into public.match_players (match_id, seat, team, user_id, name)
  select v_id, (s ->> 'index')::smallint, (s ->> 'team')::public.team,
         (select p.id from public.profiles p where p.id = (s ->> 'userId')::uuid),
         left(coalesce(s ->> 'name', ''), 24)
  from jsonb_array_elements(p_record -> 'seats') s;

  insert into public.match_events (match_id, seq, kind, team, delta, author_seat, undoes_seq, client_ts)
  select v_id, (e ->> 'seq')::int, e ->> 'kind', (e ->> 'team')::public.team,
         coalesce((e ->> 'delta')::smallint, 0), (e ->> 'authorSeat')::smallint,
         (e ->> 'undoesSeq')::int, (e ->> 'timestamp')::timestamptz
  from jsonb_array_elements(p_record -> 'events') e;

  return v_match;
end;
$$;

revoke execute on function public.finish_match from public, anon;
grant execute on function public.finish_match to authenticated;

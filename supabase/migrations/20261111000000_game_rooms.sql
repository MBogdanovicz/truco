-- Phase 2: online card games in rooms, judged by the server.
--
-- The Edge Function "game" runs the same Dart engine as the app (compiled
-- to JavaScript) and is the only writer of these tables (service role).
-- Each person reads their own view of the table (game_views) and gets
-- changes over Realtime; the deck order and the action log stay in
-- game_states, which nobody but the server can read.
--
-- Rankings get a "board": 'all' (every game, as before), 'scorekeeper'
-- (games marked on the scoreboard) and 'game' (games played in the app).
-- Ranked app games need 4 people with e-mail accounts and no computer
-- player; the server saw every card, so no confirmation is needed.
--
-- Safe for the app version on main: the old leaderboard view keeps
-- showing the 'all' board, and finish_match() keeps its signature.

-- --------------------------------------------------------------- rooms --

create type public.game_room_status as enum ('lobby', 'playing', 'finished', 'closed');

create table public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null check (code ~ '^[A-Z0-9]{6}$'),
  host_id uuid not null references public.profiles (id) on delete cascade,
  status public.game_room_status not null default 'lobby',
  rules jsonb not null default '{}',
  bot_level text not null default 'medium' check (bot_level in ('easy', 'medium', 'hard')),
  mode public.match_mode not null default 'ranked',
  group_id uuid references public.groups (id) on delete set null,
  -- Computer level per seat in the current game (null: a person).
  bots jsonb not null default '[null, null, null, null]',
  -- Games won by each team in this room (rematches).
  wins_a int not null default 0,
  wins_b int not null default 0,
  game_no int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index game_rooms_open_code on public.game_rooms (code) where status <> 'closed';

create table public.game_seats (
  room_id uuid not null references public.game_rooms (id) on delete cascade,
  seat smallint not null check (seat between 0 and 3),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null default '',
  is_guest boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (room_id, seat),
  unique (room_id, user_id)
);

create index game_seats_user on public.game_seats (user_id);

-- Server only: the seed (deck order) and every action of the current game.
create table public.game_states (
  room_id uuid primary key references public.game_rooms (id) on delete cascade,
  seed bigint not null,
  first_dealer smallint not null,
  log jsonb not null default '[]',
  version int not null default 0,
  -- A person left during the game and the computer took the seat.
  replaced boolean not null default false,
  started_at timestamptz not null default now(),
  match_id uuid
);

-- What each person sees: the frames of the last change, in order.
create table public.game_views (
  room_id uuid not null references public.game_rooms (id) on delete cascade,
  seat smallint not null check (seat between 0 and 3),
  user_id uuid not null references public.profiles (id) on delete cascade,
  version int not null,
  frames jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (room_id, seat)
);

create index game_views_user on public.game_views (user_id);

alter table public.game_rooms enable row level security;
alter table public.game_seats enable row level security;
alter table public.game_states enable row level security;
alter table public.game_views enable row level security;

-- Guests can play in rooms too, so these are open to any signed-in user.
create policy "game rooms are readable" on public.game_rooms
  for select to authenticated using (true);
create policy "game seats are readable" on public.game_seats
  for select to authenticated using (true);
create policy "own game view" on public.game_views
  for select to authenticated using (user_id = auth.uid());
-- game_states: no policy, service role only. No write policies anywhere.

revoke insert, update, delete on public.game_rooms, public.game_seats,
  public.game_views from anon, authenticated;
revoke all on public.game_states from anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime' and not puballtables) then
    alter publication supabase_realtime add table public.game_rooms, public.game_seats, public.game_views;
  end if;
end;
$$;

-- --------------------------------------------------------- match kind --

alter table public.matches
  add column kind text not null default 'scorekeeper' check (kind in ('scorekeeper', 'game')),
  add column game_room_id uuid references public.game_rooms (id) on delete set null;

-- ------------------------------------------------------ rating boards --

alter table public.ratings add column board text not null default 'all'
  check (board in ('all', 'scorekeeper', 'game'));
alter table public.ratings drop constraint ratings_pkey;
alter table public.ratings add primary key (board, scope_type, scope_id, subject_type, subject_key);
drop index if exists public.ratings_board;
create index ratings_board on public.ratings (board, scope_type, scope_id, subject_type, elo desc);

drop function public._apply_ratings(uuid, public.rating_scope, uuid);

create function public._apply_ratings(
  p_match uuid, p_scope public.rating_scope, p_scope_id uuid, p_board text default 'all'
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m public.matches;
  v_team public.team;
  v_won boolean;
  v_pf int;
  v_pa int;
  v_avg double precision;
  v_opp_avg double precision;
  v_duo double precision;
  v_opp_duo double precision;
  v_players uuid[];
  v_opp uuid[];
  v_key text;
  v_opp_key text;
  v_p uuid;
begin
  perform pg_advisory_xact_lock(hashtext('public.ratings'));

  select * into v_m from public.matches where id = p_match;

  for v_team in select unnest(array['a', 'b']::public.team[]) loop
    select array_agg(user_id order by user_id::text) into v_players
    from public.match_players where match_id = p_match and team = v_team;
    foreach v_p in array v_players loop
      insert into public.ratings (board, scope_type, scope_id, subject_type, subject_key, player_a)
      values (p_board, p_scope, p_scope_id, 'player', v_p::text, v_p) on conflict do nothing;
    end loop;
    insert into public.ratings (board, scope_type, scope_id, subject_type, subject_key, player_a, player_b)
    values (p_board, p_scope, p_scope_id, 'duo', v_players[1]::text || ':' || v_players[2]::text,
            v_players[1], v_players[2])
    on conflict do nothing;
  end loop;

  create temp table if not exists _elo_delta (key text, subject public.rating_subject, delta double precision,
    won boolean, pf int, pa int) on commit drop;
  delete from _elo_delta where true;

  for v_team in select unnest(array['a', 'b']::public.team[]) loop
    select array_agg(user_id order by user_id::text) into v_players
    from public.match_players where match_id = p_match and team = v_team;
    select array_agg(user_id order by user_id::text) into v_opp
    from public.match_players where match_id = p_match and team <> v_team;
    v_key := v_players[1]::text || ':' || v_players[2]::text;
    v_opp_key := v_opp[1]::text || ':' || v_opp[2]::text;
    v_won := v_m.winner = v_team;
    v_pf := case when v_team = 'a' then v_m.score_a else v_m.score_b end;
    v_pa := case when v_team = 'a' then v_m.score_b else v_m.score_a end;

    select avg(elo) into v_avg from public.ratings
    where board = p_board and scope_type = p_scope and scope_id = p_scope_id and subject_type = 'player'
      and subject_key = any (select unnest(v_players)::text);
    select avg(elo) into v_opp_avg from public.ratings
    where board = p_board and scope_type = p_scope and scope_id = p_scope_id and subject_type = 'player'
      and subject_key = any (select unnest(v_opp)::text);

    insert into _elo_delta
    select r.subject_key, 'player',
           public.elo_k(r.games) * ((case when v_won then 1 else 0 end) - public.elo_expected(v_avg, v_opp_avg)),
           v_won, v_pf, v_pa
    from public.ratings r
    where r.board = p_board and r.scope_type = p_scope and r.scope_id = p_scope_id and r.subject_type = 'player'
      and r.subject_key = any (select unnest(v_players)::text);

    select elo into v_duo from public.ratings
    where board = p_board and scope_type = p_scope and scope_id = p_scope_id
      and subject_type = 'duo' and subject_key = v_key;
    select elo into v_opp_duo from public.ratings
    where board = p_board and scope_type = p_scope and scope_id = p_scope_id
      and subject_type = 'duo' and subject_key = v_opp_key;

    insert into _elo_delta
    select v_key, 'duo',
           public.elo_k(r.games) * ((case when v_won then 1 else 0 end) - public.elo_expected(v_duo, v_opp_duo)),
           v_won, v_pf, v_pa
    from public.ratings r
    where r.board = p_board and r.scope_type = p_scope and r.scope_id = p_scope_id
      and r.subject_type = 'duo' and r.subject_key = v_key;
  end loop;

  update public.ratings r set
    elo = r.elo + d.delta,
    games = r.games + 1,
    wins = r.wins + (case when d.won then 1 else 0 end),
    losses = r.losses + (case when d.won then 0 else 1 end),
    points_for = r.points_for + d.pf,
    points_against = r.points_against + d.pa,
    shutouts_for = r.shutouts_for + (case when d.won and d.pa = 0 then 1 else 0 end),
    shutouts_against = r.shutouts_against + (case when not d.won and d.pf = 0 then 1 else 0 end),
    updated_at = now()
  from _elo_delta d
  where r.board = p_board and r.scope_type = p_scope and r.scope_id = p_scope_id
    and r.subject_type = d.subject and r.subject_key = d.key;
end;
$$;

revoke execute on function public._apply_ratings from public, anon, authenticated;

-- Applies a ranked match to the 'all' board and to its own board.
create function public._apply_match_ratings(p_match uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m public.matches;
  v_board text;
begin
  select * into v_m from public.matches where id = p_match;
  foreach v_board in array array['all', v_m.kind] loop
    perform public._apply_ratings(p_match, 'global', '00000000-0000-0000-0000-000000000000', v_board);
    if v_m.group_id is not null then
      perform public._apply_ratings(p_match, 'group', v_m.group_id, v_board);
    end if;
  end loop;
end;
$$;

revoke execute on function public._apply_match_ratings from public, anon, authenticated;

create or replace function public._confirm_match(p_match uuid, p_user uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m public.matches;
  v_team public.team;
begin
  select * into v_m from public.matches where id = p_match for update;
  if not v_m.is_ranked or v_m.ratings_applied then
    return;
  end if;

  select team into v_team from public.match_players
  where match_id = p_match and user_id = p_user;
  if v_team is null then
    return;
  end if;

  insert into public.match_confirmations (match_id, user_id, team)
  values (p_match, p_user, v_team)
  on conflict do nothing;

  if (select count(distinct team) from public.match_confirmations where match_id = p_match) = 2 then
    perform public._apply_match_ratings(p_match);
    update public.matches set ratings_applied = true where id = p_match;
    perform public._award_achievements(p_match);
  end if;
end;
$$;

create or replace function public.recompute_ratings()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m record;
begin
  perform pg_advisory_xact_lock(hashtext('public.ratings'));
  delete from public.ratings where true;
  for v_m in
    select id from public.matches where is_ranked and ratings_applied order by finished_at, id
  loop
    perform public._apply_match_ratings(v_m.id);
  end loop;
end;
$$;

revoke execute on function public.recompute_ratings from public, anon, authenticated;

-- The old view (app versions before phase 2) shows the 'all' board.
create or replace view public.leaderboard with (security_invoker = true) as
select r.scope_type, r.scope_id, r.subject_type, r.subject_key,
       r.player_a, pa.display_name as name_a,
       r.player_b, pb.display_name as name_b,
       r.elo, r.games, r.wins, r.losses, r.points_for, r.points_against,
       case when r.games = 0 then 0 else r.wins::double precision / r.games end as win_rate,
       pa.email_hint as hint_a, pb.email_hint as hint_b,
       r.shutouts_for, r.shutouts_against
from public.ratings r
join public.profiles pa on pa.id = r.player_a
left join public.profiles pb on pb.id = r.player_b
where r.board = 'all';

create view public.leaderboard_boards with (security_invoker = true) as
select r.board, r.scope_type, r.scope_id, r.subject_type, r.subject_key,
       r.player_a, pa.display_name as name_a,
       r.player_b, pb.display_name as name_b,
       r.elo, r.games, r.wins, r.losses, r.points_for, r.points_against,
       case when r.games = 0 then 0 else r.wins::double precision / r.games end as win_rate,
       pa.email_hint as hint_a, pb.email_hint as hint_b,
       r.shutouts_for, r.shutouts_against
from public.ratings r
join public.profiles pa on pa.id = r.player_a
left join public.profiles pb on pb.id = r.player_b;

grant select on public.leaderboard_boards to authenticated;

-- ------------------------------------------------------- game results --

-- Saves a finished app game; called by the "game" Edge Function only.
-- p_hands: [{w: 'a'|'b'|null, p: points}] in order, for the history and
-- the achievements that look at how the score went.
create function public.record_game_result(
  p_room uuid,
  p_scores int[],
  p_hands jsonb,
  p_started_at timestamptz
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_room public.game_rooms;
  v_state public.game_states;
  v_id uuid;
  v_winner public.team;
  v_ranked boolean;
  v_group uuid;
begin
  select * into v_room from public.game_rooms where id = p_room;
  select * into v_state from public.game_states where room_id = p_room for update;
  if v_state.match_id is not null then
    return v_state.match_id;
  end if;

  v_winner := case when p_scores[1] > p_scores[2] then 'a' else 'b' end;
  v_id := gen_random_uuid();

  -- Ranked: asked for, four e-mail accounts, nobody replaced by the computer.
  select v_room.mode = 'ranked'
         and not v_state.replaced
         and count(*) = 4
         and count(*) filter (where s.is_guest) = 0
  into v_ranked
  from public.game_seats s where s.room_id = p_room;

  if v_ranked and v_room.group_id is not null and (
    select count(*) from public.game_seats s
    where s.room_id = p_room and public.is_group_member(v_room.group_id, s.user_id)
  ) = 4 then
    v_group := v_room.group_id;
  end if;

  insert into public.matches (
    id, room_id, game_room_id, host_id, transport, mode, kind, target_score,
    score_a, score_b, winner, team_name_a, team_name_b, is_ranked,
    started_at, finished_at, group_id
  ) values (
    v_id, null, p_room, v_room.host_id, 'online', v_room.mode, 'game', 12,
    p_scores[1], p_scores[2], v_winner, 'Nós', 'Eles', v_ranked,
    p_started_at, now(), v_group
  );

  insert into public.match_players (match_id, seat, team, user_id, name)
  select v_id, seat, case when seat % 2 = 0 then 'a' else 'b' end::public.team,
         s.user_id, left(s.name, 24)
  from public.game_seats s where s.room_id = p_room;

  insert into public.match_events (match_id, seq, kind, team, delta, author_seat, client_ts)
  select v_id, h.ord::int, 'score', (h.e ->> 'w')::public.team, (h.e ->> 'p')::smallint, 0, now()
  from jsonb_array_elements(p_hands) with ordinality as h(e, ord)
  where h.e ->> 'w' is not null;

  update public.game_states set match_id = v_id where room_id = p_room;

  if v_ranked then
    perform public._apply_match_ratings(v_id);
    update public.matches set ratings_applied = true where id = v_id;
    perform public._award_achievements(v_id);
  end if;

  return v_id;
end;
$$;

revoke execute on function public.record_game_result from public, anon, authenticated;
grant execute on function public.record_game_result to service_role;

select public.recompute_ratings();

-- M4: groups and leaderboards.

create type public.group_visibility as enum ('public', 'private');
create type public.group_role as enum ('owner', 'admin', 'member');

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 40),
  description text not null default '' check (char_length(description) <= 200),
  visibility public.group_visibility not null default 'private',
  join_code text not null unique check (join_code ~ '^[A-Z0-9]{6}$'),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.group_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index group_members_user on public.group_members (user_id);

-- Membership check usable inside RLS policies without recursion.
create function public.is_group_member(p_group uuid, p_user uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.group_members where group_id = p_group and user_id = p_user);
$$;

create function public.group_role_of(p_group uuid, p_user uuid default auth.uid())
returns public.group_role
language sql stable security definer set search_path = ''
as $$
  select role from public.group_members where group_id = p_group and user_id = p_user;
$$;

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

create policy "public groups and own groups are visible"
  on public.groups for select to authenticated
  using (visibility = 'public' or public.is_group_member(id));

create policy "owners and admins edit their group"
  on public.groups for update to authenticated
  using (public.group_role_of(id) in ('owner', 'admin'))
  with check (public.group_role_of(id) in ('owner', 'admin'));

revoke insert, update, delete on public.groups from anon, authenticated;
grant update (name, description, visibility) on public.groups to authenticated;

create policy "members of visible groups are visible"
  on public.group_members for select to authenticated
  using (public.is_group_member(group_id)
         or exists (select 1 from public.groups g where g.id = group_id and g.visibility = 'public'));

revoke insert, update, delete on public.group_members from anon, authenticated;
-- All membership changes go through the functions below.

create function public._new_join_code()
returns text
language plpgsql volatile set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
begin
  loop
    select string_agg(substr(v_alphabet, 1 + floor(random() * 32)::int, 1), '')
      into v_code from generate_series(1, 6);
    exit when not exists (select 1 from public.groups where join_code = v_code);
  end loop;
  return v_code;
end;
$$;

-- Free accounts may own up to this many groups.
create function public.free_group_limit() returns int language sql immutable as $$ select 2 $$;

create function public.create_group(p_name text, p_description text default '', p_visibility public.group_visibility default 'private')
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group public.groups;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not (select is_premium from public.profiles where id = v_uid)
     and (select count(*) from public.groups where owner_id = v_uid) >= public.free_group_limit() then
    raise exception 'group_limit_reached' using errcode = 'P0001';
  end if;
  insert into public.groups (name, description, visibility, join_code, owner_id)
  values (trim(p_name), coalesce(trim(p_description), ''), p_visibility, public._new_join_code(), v_uid)
  returning * into v_group;
  insert into public.group_members (group_id, user_id, role) values (v_group.id, v_uid, 'owner');
  return v_group;
end;
$$;

-- Joins by invite code (any group) or by id (public groups only).
create function public.join_group(p_code text default null, p_group_id uuid default null)
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group public.groups;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_code is not null then
    select * into v_group from public.groups where join_code = upper(trim(p_code));
  else
    select * into v_group from public.groups where id = p_group_id and visibility = 'public';
  end if;
  if not found then raise exception 'group_not_found' using errcode = 'P0002'; end if;
  insert into public.group_members (group_id, user_id) values (v_group.id, v_uid)
  on conflict do nothing;
  return v_group;
end;
$$;

-- Leaves a group. The owner passes ownership to the oldest admin/member, or the
-- group is deleted when nobody is left.
create function public.leave_group(p_group_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_next uuid;
begin
  delete from public.group_members where group_id = p_group_id and user_id = v_uid;
  if (select owner_id from public.groups where id = p_group_id) = v_uid then
    select user_id into v_next from public.group_members
    where group_id = p_group_id
    order by (role = 'admin') desc, joined_at
    limit 1;
    if v_next is null then
      delete from public.groups where id = p_group_id;
    else
      update public.groups set owner_id = v_next where id = p_group_id;
      update public.group_members set role = 'owner' where group_id = p_group_id and user_id = v_next;
    end if;
  end if;
end;
$$;

create function public.remove_group_member(p_group_id uuid, p_user_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if public.group_role_of(p_group_id) not in ('owner', 'admin') then
    raise exception 'not allowed';
  end if;
  if public.group_role_of(p_group_id, p_user_id) = 'owner' then
    raise exception 'cannot remove the owner';
  end if;
  delete from public.group_members where group_id = p_group_id and user_id = p_user_id;
end;
$$;

create function public.regenerate_group_code(p_group_id uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_code text := public._new_join_code();
begin
  if public.group_role_of(p_group_id) not in ('owner', 'admin') then
    raise exception 'not allowed';
  end if;
  update public.groups set join_code = v_code where id = p_group_id;
  return v_code;
end;
$$;

revoke execute on function public.create_group, public.join_group, public.leave_group,
  public.remove_group_member, public.regenerate_group_code, public._new_join_code
  from public, anon;
grant execute on function public.create_group, public.join_group, public.leave_group,
  public.remove_group_member, public.regenerate_group_code to authenticated;

-- ------------------------------------------------------------------ ratings

alter table public.matches add column group_id uuid references public.groups (id) on delete set null;

create type public.rating_scope as enum ('global', 'group');
create type public.rating_subject as enum ('player', 'duo');

-- One row per (scope, subject). Global rows use the nil uuid as scope_id.
create table public.ratings (
  scope_type public.rating_scope not null,
  scope_id uuid not null,
  subject_type public.rating_subject not null,
  subject_key text not null,          -- user id, or "<uuid>:<uuid>" sorted for duos
  player_a uuid not null references public.profiles (id) on delete cascade,
  player_b uuid references public.profiles (id) on delete cascade,
  elo double precision not null default 1000,
  games int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  points_for int not null default 0,
  points_against int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (scope_type, scope_id, subject_type, subject_key)
);

create index ratings_board on public.ratings (scope_type, scope_id, subject_type, elo desc);

alter table public.ratings enable row level security;

create policy "global ratings are public, group ratings for visible groups"
  on public.ratings for select to authenticated
  using (scope_type = 'global'
         or exists (select 1 from public.groups g where g.id = scope_id));  -- groups RLS applies

revoke insert, update, delete on public.ratings from anon, authenticated;

-- Elo maths, mirrored by lib/domain/ranking/elo.dart (keep in sync).
create function public.elo_k(p_games int) returns double precision
language sql immutable as $$ select case when p_games < 20 then 40.0 else 24.0 end $$;

create function public.elo_expected(p_rating double precision, p_opponent double precision)
returns double precision
language sql immutable as $$ select 1.0 / (1.0 + power(10.0, (p_opponent - p_rating) / 400.0)) $$;

-- Applies one ranked match to the ratings of one scope.
create function public._apply_ratings(p_match uuid, p_scope public.rating_scope, p_scope_id uuid)
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
  select * into v_m from public.matches where id = p_match;

  -- Make sure every row exists before reading ratings.
  for v_team in select unnest(array['a', 'b']::public.team[]) loop
    select array_agg(user_id order by user_id::text) into v_players
    from public.match_players where match_id = p_match and team = v_team;
    foreach v_p in array v_players loop
      insert into public.ratings (scope_type, scope_id, subject_type, subject_key, player_a)
      values (p_scope, p_scope_id, 'player', v_p::text, v_p) on conflict do nothing;
    end loop;
    insert into public.ratings (scope_type, scope_id, subject_type, subject_key, player_a, player_b)
    values (p_scope, p_scope_id, 'duo', v_players[1]::text || ':' || v_players[2]::text, v_players[1], v_players[2])
    on conflict do nothing;
  end loop;

  -- Compute all deltas from the pre-match ratings, then write.
  create temp table if not exists _elo_delta (key text, subject public.rating_subject, delta double precision,
    won boolean, pf int, pa int) on commit drop;
  delete from _elo_delta;

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
    where scope_type = p_scope and scope_id = p_scope_id and subject_type = 'player'
      and subject_key = any (select unnest(v_players)::text);
    select avg(elo) into v_opp_avg from public.ratings
    where scope_type = p_scope and scope_id = p_scope_id and subject_type = 'player'
      and subject_key = any (select unnest(v_opp)::text);

    insert into _elo_delta
    select r.subject_key, 'player',
           public.elo_k(r.games) * ((case when v_won then 1 else 0 end) - public.elo_expected(v_avg, v_opp_avg)),
           v_won, v_pf, v_pa
    from public.ratings r
    where r.scope_type = p_scope and r.scope_id = p_scope_id and r.subject_type = 'player'
      and r.subject_key = any (select unnest(v_players)::text);

    select elo into v_duo from public.ratings
    where scope_type = p_scope and scope_id = p_scope_id and subject_type = 'duo' and subject_key = v_key;
    select elo into v_opp_duo from public.ratings
    where scope_type = p_scope and scope_id = p_scope_id and subject_type = 'duo' and subject_key = v_opp_key;

    insert into _elo_delta
    select v_key, 'duo',
           public.elo_k(r.games) * ((case when v_won then 1 else 0 end) - public.elo_expected(v_duo, v_opp_duo)),
           v_won, v_pf, v_pa
    from public.ratings r
    where r.scope_type = p_scope and r.scope_id = p_scope_id and r.subject_type = 'duo' and r.subject_key = v_key;
  end loop;

  update public.ratings r set
    elo = r.elo + d.delta,
    games = r.games + 1,
    wins = r.wins + (case when d.won then 1 else 0 end),
    losses = r.losses + (case when d.won then 0 else 1 end),
    points_for = r.points_for + d.pf,
    points_against = r.points_against + d.pa,
    updated_at = now()
  from _elo_delta d
  where r.scope_type = p_scope and r.scope_id = p_scope_id
    and r.subject_type = d.subject and r.subject_key = d.key;
end;
$$;

revoke execute on function public._apply_ratings from public, anon, authenticated;

-- finish_match v2: optional group, ratings for ranked games.
drop function public.finish_match(jsonb, public.match_transport, uuid, public.match_mode);

create function public.finish_match(
  p_record jsonb,
  p_transport public.match_transport,
  p_room_id uuid default null,
  p_mode public.match_mode default 'ranked',
  p_group_id uuid default null
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
  v_group uuid;
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

  select p_mode = 'ranked'
         and count(*) = 4
         and count(distinct (s ->> 'userId')) = 4
         and count(*) filter (where s ->> 'team' = 'a') = 2
         and count(*) filter (where p.id is not null) = 4
  into v_ranked
  from jsonb_array_elements(p_record -> 'seats') s
  left join public.profiles p on p.id = (s ->> 'userId')::uuid
  where s ->> 'userId' is not null;

  -- The group only counts when every seated player belongs to it.
  if p_group_id is not null and coalesce(v_ranked, false) and (
    select count(*) from jsonb_array_elements(p_record -> 'seats') s
    where public.is_group_member(p_group_id, (s ->> 'userId')::uuid)
  ) = 4 then
    v_group := p_group_id;
  end if;

  insert into public.matches (
    id, room_id, host_id, transport, mode, target_score, score_a, score_b, winner,
    team_name_a, team_name_b, is_ranked, started_at, finished_at, group_id
  ) values (
    v_id, p_room_id, v_uid, p_transport, p_mode, v_target, v_score_a, v_score_b, v_winner,
    left(coalesce(p_record -> 'teamNames' ->> 'a', 'Nós'), 20),
    left(coalesce(p_record -> 'teamNames' ->> 'b', 'Eles'), 20),
    coalesce(v_ranked, false),
    (p_record ->> 'startedAt')::timestamptz,
    (p_record ->> 'finishedAt')::timestamptz,
    v_group
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

  if v_match.is_ranked then
    perform public._apply_ratings(v_id, 'global', '00000000-0000-0000-0000-000000000000');
    if v_group is not null then
      perform public._apply_ratings(v_id, 'group', v_group);
    end if;
  end if;

  return v_match;
end;
$$;

revoke execute on function public.finish_match from public, anon;
grant execute on function public.finish_match to authenticated;

-- Leaderboard rows with display names.
create view public.leaderboard with (security_invoker = true) as
select r.scope_type, r.scope_id, r.subject_type, r.subject_key,
       r.player_a, pa.display_name as name_a,
       r.player_b, pb.display_name as name_b,
       r.elo, r.games, r.wins, r.losses, r.points_for, r.points_against,
       case when r.games = 0 then 0 else r.wins::double precision / r.games end as win_rate
from public.ratings r
join public.profiles pa on pa.id = r.player_a
left join public.profiles pb on pb.id = r.player_b;

grant select on public.leaderboard to authenticated;

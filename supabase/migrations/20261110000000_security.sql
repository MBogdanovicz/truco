-- Security hardening before the public release.
--
-- 1. Ranked results need both teams. Before, any seated player could upload
--    a made-up ranked game with any four accounts and move everyone's Elo.
--    Now each seated player's device uploads the game; ratings change only
--    once at least one player of each team has confirmed the same result.
-- 2. Joining by code goes through find_open_room(), so the client no longer
--    needs to list the rooms table. Restricting that table to its host is a
--    separate step (see 20261110000001_rooms_host_only.sql) because older
--    builds still read it directly.

alter table public.matches
  add column ratings_applied boolean not null default false;

-- Games already counted keep counting.
update public.matches set ratings_applied = true where is_ranked;

-- Who confirmed a result. Written only by finish_match().
create table public.match_confirmations (
  match_id uuid not null references public.matches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  team public.team not null,
  confirmed_at timestamptz not null default now(),
  primary key (match_id, user_id)
);

alter table public.match_confirmations enable row level security;
revoke all on public.match_confirmations from anon, authenticated;

-- Records the caller's confirmation and applies ratings when both teams
-- agree. Returns nothing; finish_match() calls it.
create function public._confirm_match(p_match uuid, p_user uuid)
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
    perform public._apply_ratings(p_match, 'global', '00000000-0000-0000-0000-000000000000');
    if v_m.group_id is not null then
      perform public._apply_ratings(p_match, 'group', v_m.group_id);
    end if;
    update public.matches set ratings_applied = true where id = p_match;
  end if;
end;
$$;

revoke execute on function public._confirm_match from public, anon, authenticated;

create or replace function public.finish_match(
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

  -- Several players upload the same game at about the same time.
  perform pg_advisory_xact_lock(hashtext('public.finish_match:' || v_id::text));

  select * into v_match from public.matches where id = v_id;
  if found then
    -- Another player already saved it: count this as a confirmation when
    -- this player sees the same result.
    if v_match.score_a = v_score_a and v_match.score_b = v_score_b then
      perform public._confirm_match(v_id, v_uid);
      select * into v_match from public.matches where id = v_id;
    end if;
    return v_match;
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
    perform public._confirm_match(v_id, v_uid);
    select * into v_match from public.matches where id = v_id;
  end if;

  return v_match;
end;
$$;

revoke execute on function public.finish_match from public, anon;
grant execute on function public.finish_match to authenticated;

-- Rebuilds count only confirmed games.
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
    select id, group_id from public.matches
    where is_ranked and ratings_applied
    order by finished_at, id
  loop
    perform public._apply_ratings(v_m.id, 'global', '00000000-0000-0000-0000-000000000000');
    if v_m.group_id is not null then
      perform public._apply_ratings(v_m.id, 'group', v_m.group_id);
    end if;
  end loop;
end;
$$;

revoke execute on function public.recompute_ratings from public, anon, authenticated;

-- Finds an open room by its join code without listing the table.
create function public.find_open_room(p_code text)
returns uuid
language sql stable security definer set search_path = ''
as $$
  select id from public.rooms
  where code = upper(trim(p_code)) and closed_at is null
    and auth.uid() is not null
  limit 1;
$$;

revoke execute on function public.find_open_room from public, anon;
grant execute on function public.find_open_room to authenticated;

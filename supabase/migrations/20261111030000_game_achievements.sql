-- Phase 3: achievements of the app's truco game. Only ranked games count.
--
-- The game engine (Edge Function "game") reports what each seat did
-- (p_feats: {"<seat>": [id]}); the ids it may send are listed below. Wins
-- in the game are counted here. Keep in sync with lib/domain/achievements.dart
-- and lib/domain/game/game_feats.dart.
--
-- Run this BEFORE deploying the new "game" Edge Function (it calls
-- record_game_result with p_feats). The old function still works with it.
-- Safe to run again.

create or replace function public._award_game_achievements(p_match uuid, p_feats jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m public.matches;
  v_p record;
  v_wins int;
  v_feat text;
begin
  select * into v_m from public.matches where id = p_match;
  if not found or v_m.kind <> 'game' or not (v_m.is_ranked and v_m.ratings_applied) then
    return;
  end if;

  for v_p in
    select seat, user_id, team from public.match_players
    where match_id = p_match and user_id is not null
  loop
    select count(*) into v_wins
    from public.match_players mp
    join public.matches m on m.id = mp.match_id
    where mp.user_id = v_p.user_id and m.kind = 'game'
      and m.is_ranked and m.ratings_applied and m.winner = mp.team
      and (m.finished_at, m.id) <= (v_m.finished_at, v_m.id);
    if v_wins >= 1 then
      perform public._unlock(v_p.user_id, 'game_first_win', p_match, v_m.finished_at);
    end if;
    if v_wins >= 10 then
      perform public._unlock(v_p.user_id, 'game_wins_10', p_match, v_m.finished_at);
    end if;
    if v_m.winner = v_p.team and least(v_m.score_a, v_m.score_b) = 0 then
      perform public._unlock(v_p.user_id, 'game_shutout', p_match, v_m.finished_at);
    end if;

    for v_feat in
      select jsonb_array_elements_text(coalesce(p_feats -> v_p.seat::text, '[]'))
    loop
      if v_feat in (
        'game_truco_12', 'game_ran_won', 'game_iron_hand', 'game_comadre',
        'game_ace_river', 'game_666', 'game_seis_burro', 'game_casal_maior',
        'game_casal_menor', 'game_casal_preto', 'game_casal_vermelho'
      ) then
        perform public._unlock(v_p.user_id, v_feat, p_match, v_m.finished_at);
      end if;
    end loop;
  end loop;
end;
$$;

revoke execute on function public._award_game_achievements from public, anon, authenticated;

-- Same as in 20261111000000_game_rooms.sql, plus p_feats.
drop function if exists public.record_game_result(uuid, int[], jsonb, timestamptz);
drop function if exists public.record_game_result(uuid, int[], jsonb, timestamptz, jsonb);

create function public.record_game_result(
  p_room uuid,
  p_scores int[],
  p_hands jsonb,
  p_started_at timestamptz,
  p_feats jsonb default '{}'
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
    perform public._award_game_achievements(v_id, coalesce(p_feats, '{}'));
  end if;

  return v_id;
end;
$$;

revoke execute on function public.record_game_result from public, anon, authenticated;
grant execute on function public.record_game_result to service_role;

-- Wins in ranked games already played.
do $$
declare
  v_id uuid;
begin
  for v_id in
    select id from public.matches
    where kind = 'game' and is_ranked and ratings_applied
    order by finished_at, id
  loop
    perform public._award_game_achievements(v_id, '{}');
  end loop;
end;
$$;

-- Achievements. Unlocked by the server, only from confirmed ranked games
-- (the same games that move Elo), so nobody can farm them with made-up
-- matches. The Android app mirrors them to Google Play Games.
--
-- Ids (keep in sync with lib/domain/achievements.dart):
--   first_game, first_win, veteran_10, veteran_50, veteran_100, shutout,
--   comeback, streak_5, loyal_partner, revenge, group_game

create table public.achievements_unlocked (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement text not null,
  match_id uuid references public.matches (id) on delete set null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement)
);

alter table public.achievements_unlocked enable row level security;
revoke insert, update, delete on public.achievements_unlocked from anon, authenticated;

create policy "users read their achievements"
  on public.achievements_unlocked for select to authenticated
  using (user_id = auth.uid());

create policy "full accounts only"
  on public.achievements_unlocked as restrictive for all to public
  using (public.is_full_account()) with check (public.is_full_account());

create function public._unlock(p_user uuid, p_achievement text, p_match uuid, p_at timestamptz)
returns void
language sql security definer set search_path = ''
as $$
  insert into public.achievements_unlocked (user_id, achievement, match_id, unlocked_at)
  values (p_user, p_achievement, p_match, coalesce(p_at, now()))
  on conflict do nothing;
$$;

revoke execute on function public._unlock from public, anon, authenticated;

-- Checks every seated account of one confirmed ranked game. Counts only
-- games up to this one, so replaying old games in order gives the same
-- result as checking them as they were played.
create function public._award_achievements(p_match uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_m public.matches;
  v_p record;
  v_won boolean;
  v_games int;
  v_wins int;
  v_last int;
  v_last_wins int;
  v_deficit int;
  v_partner uuid;
  v_together int;
  v_opp uuid[];
  v_prev_won boolean;
  v_prev_opp uuid[];
begin
  select * into v_m from public.matches where id = p_match;
  if not found or not (v_m.is_ranked and v_m.ratings_applied) then
    return;
  end if;

  -- Largest lead the losers had at any point (what the winners overcame).
  with undone as (
    select undoes_seq from public.match_events
    where match_id = p_match and kind = 'undo' and undoes_seq is not null
  ), ev as (
    select seq, team, delta from public.match_events
    where match_id = p_match and kind = 'score'
      and seq not in (select undoes_seq from undone)
  ), run as (
    select sum(case when team = v_m.winner then -delta else delta end)
             over (order by seq) as lead
    from ev
  )
  select coalesce(max(lead), 0) into v_deficit from run;

  for v_p in
    select user_id, team from public.match_players
    where match_id = p_match and user_id is not null
  loop
    v_won := v_p.team = v_m.winner;

    select count(*), count(*) filter (where m.winner = mp.team)
    into v_games, v_wins
    from public.match_players mp
    join public.matches m on m.id = mp.match_id
    where mp.user_id = v_p.user_id and m.is_ranked and m.ratings_applied
      and (m.finished_at, m.id) <= (v_m.finished_at, v_m.id);

    perform public._unlock(v_p.user_id, 'first_game', p_match, v_m.finished_at);
    if v_wins >= 1 then
      perform public._unlock(v_p.user_id, 'first_win', p_match, v_m.finished_at);
    end if;
    if v_games >= 10 then
      perform public._unlock(v_p.user_id, 'veteran_10', p_match, v_m.finished_at);
    end if;
    if v_games >= 50 then
      perform public._unlock(v_p.user_id, 'veteran_50', p_match, v_m.finished_at);
    end if;
    if v_games >= 100 then
      perform public._unlock(v_p.user_id, 'veteran_100', p_match, v_m.finished_at);
    end if;

    if v_won and least(v_m.score_a, v_m.score_b) = 0 then
      perform public._unlock(v_p.user_id, 'shutout', p_match, v_m.finished_at);
    end if;
    if v_won and v_deficit >= 8 then
      perform public._unlock(v_p.user_id, 'comeback', p_match, v_m.finished_at);
    end if;
    if v_m.group_id is not null then
      perform public._unlock(v_p.user_id, 'group_game', p_match, v_m.finished_at);
    end if;

    -- Five wins in a row.
    select count(*), count(*) filter (where won) into v_last, v_last_wins
    from (
      select m.winner = mp.team as won
      from public.match_players mp
      join public.matches m on m.id = mp.match_id
      where mp.user_id = v_p.user_id and m.is_ranked and m.ratings_applied
        and (m.finished_at, m.id) <= (v_m.finished_at, v_m.id)
      order by m.finished_at desc, m.id desc
      limit 5
    ) t;
    if v_last = 5 and v_last_wins = 5 then
      perform public._unlock(v_p.user_id, 'streak_5', p_match, v_m.finished_at);
    end if;

    -- Ten games with the same partner.
    select user_id into v_partner from public.match_players
    where match_id = p_match and team = v_p.team and user_id <> v_p.user_id;
    if v_partner is not null then
      select count(*) into v_together
      from public.match_players a
      join public.match_players b on b.match_id = a.match_id and b.team = a.team
      join public.matches m on m.id = a.match_id
      where a.user_id = v_p.user_id and b.user_id = v_partner
        and m.is_ranked and m.ratings_applied
        and (m.finished_at, m.id) <= (v_m.finished_at, v_m.id);
      if v_together >= 10 then
        perform public._unlock(v_p.user_id, 'loyal_partner', p_match, v_m.finished_at);
      end if;
    end if;

    -- Revenge: won against the same pair that beat this player last game.
    if v_won then
      select array_agg(user_id order by user_id) into v_opp
      from public.match_players where match_id = p_match and team <> v_p.team;

      select m.winner = mp.team,
             (select array_agg(x.user_id order by x.user_id)
              from public.match_players x
              where x.match_id = m.id and x.team <> mp.team)
      into v_prev_won, v_prev_opp
      from public.match_players mp
      join public.matches m on m.id = mp.match_id
      where mp.user_id = v_p.user_id and m.is_ranked and m.ratings_applied
        and (m.finished_at, m.id) < (v_m.finished_at, v_m.id)
      order by m.finished_at desc, m.id desc
      limit 1;
      if found and not v_prev_won and v_prev_opp = v_opp then
        perform public._unlock(v_p.user_id, 'revenge', p_match, v_m.finished_at);
      end if;
    end if;
  end loop;
end;
$$;

revoke execute on function public._award_achievements from public, anon, authenticated;

-- Same as in 20261110000000_security.sql, plus achievements once the game
-- counts.
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
    perform public._apply_ratings(p_match, 'global', '00000000-0000-0000-0000-000000000000');
    if v_m.group_id is not null then
      perform public._apply_ratings(p_match, 'group', v_m.group_id);
    end if;
    update public.matches set ratings_applied = true where id = p_match;
    perform public._award_achievements(p_match);
  end if;
end;
$$;

revoke execute on function public._confirm_match from public, anon, authenticated;

-- Games already played.
do $$
declare
  v_id uuid;
begin
  for v_id in
    select id from public.matches
    where is_ranked and ratings_applied
    order by finished_at, id
  loop
    perform public._award_achievements(v_id);
  end loop;
end;
$$;

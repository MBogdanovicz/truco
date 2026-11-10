-- 12 x 0 count: by tradition the team that loses 12 x 0 passes under the
-- table. Each rating row counts the shutouts it gave and the ones it took.

alter table public.ratings
  add column shutouts_for int not null default 0,
  add column shutouts_against int not null default 0;

create or replace function public._apply_ratings(p_match uuid, p_scope public.rating_scope, p_scope_id uuid)
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
  -- One rating update at a time: two games uploaded at once would
  -- otherwise both compute their changes from the same old ratings.
  perform pg_advisory_xact_lock(hashtext('public.ratings'));

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
  delete from _elo_delta where true;  -- pg_safeupdate rejects a bare DELETE

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
    -- 12 x 0: the losers pass under the table.
    shutouts_for = r.shutouts_for + (case when d.won and d.pa = 0 then 1 else 0 end),
    shutouts_against = r.shutouts_against + (case when not d.won and d.pf = 0 then 1 else 0 end),
    updated_at = now()
  from _elo_delta d
  where r.scope_type = p_scope and r.scope_id = p_scope_id
    and r.subject_type = d.subject and r.subject_key = d.key;
end;
$$;

revoke execute on function public._apply_ratings from public, anon, authenticated;

-- New columns go last.
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
left join public.profiles pb on pb.id = r.player_b;

-- Fill the counts from the games already played.
select public.recompute_ratings();

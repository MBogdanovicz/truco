-- Google Play Games achievements belong to a Google account, the app's to
-- an e-mail account. To keep them matching, each app account is linked to
-- the first Play Games player it syncs with, and each player to one app
-- account. Other combinations still earn achievements in the app; they
-- just aren't copied to Play Games.

alter table public.profiles add column play_games_player_id text;
create unique index profiles_play_games_player on public.profiles (play_games_player_id);

-- True when the caller's account is (now) linked to this Play Games player.
create function public.link_play_games(p_player text)
returns boolean
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(trim(p_player), '') = '' then
    return false;
  end if;
  update public.profiles set play_games_player_id = p_player
  where id = auth.uid() and play_games_player_id is null
    and not exists (
      select 1 from public.profiles where play_games_player_id = p_player
    );
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and play_games_player_id = p_player
  );
end;
$$;

revoke execute on function public.link_play_games from public, anon;
grant execute on function public.link_play_games to authenticated;

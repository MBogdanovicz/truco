-- Guests (anonymous sign-ins) only join scorekeeper rooms: the room code is
-- looked up by find_open_room() and the game itself travels over Realtime.
-- They use the same "authenticated" role as e-mail accounts, so these
-- restrictive policies keep them out of every table. Restrictive policies
-- are ANDed with the existing ones; e-mail accounts are not affected.

create function public.is_full_account()
returns boolean
language sql stable set search_path = ''
as $$
  select auth.uid() is not null
     and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'rooms', 'matches', 'match_players', 'match_events',
    'groups', 'group_members', 'ratings', 'premium_purchases', 'premium_invites'
  ] loop
    execute format(
      'create policy "full accounts only" on public.%I as restrictive for all '
      'to public using (public.is_full_account()) with check (public.is_full_account())',
      t
    );
  end loop;
end;
$$;

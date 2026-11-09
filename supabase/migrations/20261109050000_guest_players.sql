-- Guests: people who join a scorekeeper room without an e-mail account
-- (Supabase anonymous sign-in; enable it in Authentication > Sign In / Providers).
-- They get no profile row, so:
--   * finish_match stores them as guests (match_players.user_id is null)
--     and a game with a guest is never ranked;
--   * they cannot create rooms, groups or memberships (those reference profiles).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if new.is_anonymous then
    return new;
  end if;
  if v_name is not null and char_length(v_name) not between 2 and 24 then
    v_name := null;
  end if;
  insert into public.profiles (id, display_name)
  values (new.id, v_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.sync_profile_name()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if new.is_anonymous or v_name is null or char_length(v_name) not between 2 and 24 then
    return new;
  end if;
  insert into public.profiles (id, display_name)
  values (new.id, v_name)
  on conflict (id) do update
    set display_name = excluded.display_name, updated_at = now();
  return new;
end;
$$;

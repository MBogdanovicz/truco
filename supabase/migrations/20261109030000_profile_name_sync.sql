-- Fix: display names were never saved to profiles.
-- The app upserted {id, display_name}; PostgREST's upsert also updates "id",
-- which authenticated users may not update, so the call failed and every
-- profile kept display_name = null ("Jogador" in groups and rankings).
-- Now the profile follows the name kept in the auth user's metadata.

create or replace function public.sync_profile_name()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  v_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if v_name is null or char_length(v_name) not between 2 and 24 then
    return new;
  end if;
  insert into public.profiles (id, display_name)
  values (new.id, v_name)
  on conflict (id) do update
    set display_name = excluded.display_name, updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_name_changed
  after update of raw_user_meta_data on auth.users
  for each row
  when (new.raw_user_meta_data ->> 'display_name'
        is distinct from old.raw_user_meta_data ->> 'display_name')
  execute function public.sync_profile_name();

-- Backfill the names users already chose.
update public.profiles p
set display_name = trim(u.raw_user_meta_data ->> 'display_name'), updated_at = now()
from auth.users u
where u.id = p.id
  and char_length(trim(coalesce(u.raw_user_meta_data ->> 'display_name', ''))) between 2 and 24
  and p.display_name is distinct from trim(u.raw_user_meta_data ->> 'display_name');

-- Masked e-mail ("ma•••@gmail.com") on profiles, shown in rankings to tell
-- apart players with the same display name. The full address stays private
-- in auth.users.

alter table public.profiles add column email_hint text;

create or replace function public.mask_email(p_email text)
returns text
language sql immutable
as $$
  select case
    when p_email is null or position('@' in p_email) = 0 then null
    else left(split_part(p_email, '@', 1),
              case when char_length(split_part(p_email, '@', 1)) <= 3 then 1 else 2 end)
         || '•••@' || split_part(p_email, '@', 2)
  end
$$;

-- New users (guests still get no profile).
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
  insert into public.profiles (id, display_name, email_hint)
  values (new.id, v_name, public.mask_email(new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- E-mail changes.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles set email_hint = public.mask_email(new.email), updated_at = now()
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (new.email is distinct from old.email)
  execute function public.sync_profile_email();

-- Existing users.
update public.profiles p
set email_hint = public.mask_email(u.email)
from auth.users u
where u.id = p.id;

-- Leaderboard rows get the hints (new columns go last).
create or replace view public.leaderboard with (security_invoker = true) as
select r.scope_type, r.scope_id, r.subject_type, r.subject_key,
       r.player_a, pa.display_name as name_a,
       r.player_b, pb.display_name as name_b,
       r.elo, r.games, r.wins, r.losses, r.points_for, r.points_against,
       case when r.games = 0 then 0 else r.wins::double precision / r.games end as win_rate,
       pa.email_hint as hint_a, pb.email_hint as hint_b
from public.ratings r
join public.profiles pa on pa.id = r.player_a
left join public.profiles pb on pb.id = r.player_b;

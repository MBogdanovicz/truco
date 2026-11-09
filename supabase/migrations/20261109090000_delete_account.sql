-- Account deletion (required by Google Play for apps with accounts).
--
-- Deleting the auth user cascades to the profile, memberships, ratings,
-- purchases and invites. Finished matches stay for the other players: the
-- deleted player's seat loses its user id, and matches this player hosted
-- keep existing without a host.

alter table public.matches alter column host_id drop not null;
alter table public.matches drop constraint matches_host_id_fkey;
alter table public.matches add constraint matches_host_id_fkey
  foreign key (host_id) references public.profiles (id) on delete set null;

create function public.delete_my_account()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group uuid;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  -- Leave each group first, so owned groups pass to another member.
  for v_group in select group_id from public.group_members where user_id = v_uid loop
    perform public.leave_group(v_group);
  end loop;
  delete from auth.users where id = v_uid;
end;
$$;

revoke execute on function public.delete_my_account from public, anon;
grant execute on function public.delete_my_account to authenticated;

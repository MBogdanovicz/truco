-- Premium: one-time Play purchases, invites, and the free group limit.
--
-- Premium lives on the account (profiles.is_premium), so it also unlocks the
-- PWA when signing in with the same e-mail. Only the verify-purchase Edge
-- Function (service role) grants it, after Google confirms the purchase.
--
-- Products (Google Play, one-time):
--   premium         full price; the buyer gets 3 invites.
--   premium_invite  reduced price; only for an e-mail with a pending invite.

create table public.premium_purchases (
  purchase_token text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null check (product_id in ('premium', 'premium_invite')),
  order_id text,
  invite_id uuid,
  created_at timestamptz not null default now()
);

alter table public.premium_purchases enable row level security;

create policy "users read their own purchases"
  on public.premium_purchases for select
  using (user_id = auth.uid());

create table public.premium_invites (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles (id) on delete cascade,
  email text not null check (email = lower(trim(email)) and email like '%_@_%'),
  created_at timestamptz not null default now(),
  redeemed_by uuid references public.profiles (id) on delete set null,
  redeemed_at timestamptz,
  unique (inviter_id, email)
);

create index premium_invites_pending on public.premium_invites (email)
  where redeemed_by is null;

alter table public.premium_invites enable row level security;

create policy "inviters read their invites"
  on public.premium_invites for select
  using (inviter_id = auth.uid());

create function public.premium_invite_limit() returns int
language sql immutable as $$ select 3 $$;

create function public._user_email(p_user uuid) returns text
language sql stable security definer set search_path = ''
as $$ select lower(email) from auth.users where id = p_user $$;

-- Invites a friend (by e-mail) to buy premium at the reduced price. Only
-- full-price buyers can invite, up to 3 people (cancelled invites free a slot).
create function public.create_premium_invite(p_email text)
returns public.premium_invites
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(trim(p_email));
  v_invite public.premium_invites;
begin
  if not exists (
    select 1 from public.premium_purchases
    where user_id = v_uid and product_id = 'premium'
  ) then
    raise exception 'not_full_buyer' using errcode = 'P0001';
  end if;
  if v_email = public._user_email(v_uid) then
    raise exception 'cannot_invite_self' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from auth.users u join public.profiles p on p.id = u.id
    where lower(u.email) = v_email and p.is_premium
  ) then
    raise exception 'already_premium' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from public.premium_invites
    where inviter_id = v_uid and email = v_email
  ) then
    raise exception 'already_invited' using errcode = 'P0001';
  end if;
  if (select count(*) from public.premium_invites where inviter_id = v_uid)
     >= public.premium_invite_limit() then
    raise exception 'invite_limit_reached' using errcode = 'P0001';
  end if;
  insert into public.premium_invites (inviter_id, email)
  values (v_uid, v_email)
  returning * into v_invite;
  return v_invite;
end;
$$;

-- Withdraws an invite nobody used yet, freeing the slot.
create function public.cancel_premium_invite(p_invite_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  delete from public.premium_invites
  where id = p_invite_id and inviter_id = auth.uid() and redeemed_by is null;
end;
$$;

-- The oldest pending invite for the caller's e-mail, with the inviter's
-- name; empty when there is none or the caller is already premium.
create function public.my_premium_invite()
returns table (invite_id uuid, inviter_name text)
language sql stable security definer set search_path = ''
as $$
  select i.id, p.display_name
  from public.premium_invites i
  join public.profiles p on p.id = i.inviter_id
  where i.email = public._user_email(auth.uid())
    and i.redeemed_by is null
    and not coalesce((select is_premium from public.profiles where id = auth.uid()), false)
  order by i.created_at
  limit 1
$$;

-- Records a purchase Google confirmed and turns premium on. Idempotent for
-- the same token and user. Called only by the verify-purchase function.
create function public.grant_premium(
  p_user uuid,
  p_product text,
  p_token text,
  p_order text default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_owner uuid;
  v_invite uuid;
begin
  select user_id into v_owner from public.premium_purchases
  where purchase_token = p_token;
  if v_owner is not null then
    if v_owner <> p_user then
      raise exception 'token_used' using errcode = 'P0001';
    end if;
    return;
  end if;
  if p_product = 'premium_invite' then
    select id into v_invite from public.premium_invites
    where email = public._user_email(p_user) and redeemed_by is null
    order by created_at
    limit 1
    for update;
    if v_invite is null then
      raise exception 'no_invite' using errcode = 'P0001';
    end if;
    update public.premium_invites
    set redeemed_by = p_user, redeemed_at = now()
    where id = v_invite;
  elsif p_product <> 'premium' then
    raise exception 'unknown_product' using errcode = 'P0001';
  end if;
  insert into public.premium_purchases (purchase_token, user_id, product_id, order_id, invite_id)
  values (p_token, p_user, p_product, p_order, v_invite);
  update public.profiles set is_premium = true where id = p_user;
end;
$$;

-- ------------------------------------------------------------ group limit
--
-- A free account may be in at most 2 groups in total, created or joined
-- (before, only created groups counted). Premium has no limit.

create function public.can_be_in_another_group(p_user uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select is_premium from public.profiles where id = p_user), false)
      or (select count(*) from public.group_members where user_id = p_user)
         < public.free_group_limit()
$$;

create or replace function public.create_group(p_name text, p_description text default '', p_visibility public.group_visibility default 'private')
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group public.groups;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if not public.can_be_in_another_group(v_uid) then
    raise exception 'group_limit_reached' using errcode = 'P0001';
  end if;
  insert into public.groups (name, description, visibility, join_code, owner_id)
  values (trim(p_name), coalesce(trim(p_description), ''), p_visibility, public._new_join_code(), v_uid)
  returning * into v_group;
  insert into public.group_members (group_id, user_id, role) values (v_group.id, v_uid, 'owner');
  return v_group;
end;
$$;

create or replace function public.join_group(p_code text default null, p_group_id uuid default null)
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_group public.groups;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if p_code is not null then
    select * into v_group from public.groups where join_code = upper(trim(p_code));
  else
    select * into v_group from public.groups where id = p_group_id and visibility = 'public';
  end if;
  if not found then raise exception 'group_not_found' using errcode = 'P0002'; end if;
  if not public.is_group_member(v_group.id, v_uid)
     and not public.can_be_in_another_group(v_uid) then
    raise exception 'group_limit_reached' using errcode = 'P0001';
  end if;
  insert into public.group_members (group_id, user_id) values (v_group.id, v_uid)
  on conflict do nothing;
  return v_group;
end;
$$;

revoke execute on function public._user_email, public.create_premium_invite,
  public.cancel_premium_invite, public.my_premium_invite, public.grant_premium,
  public.can_be_in_another_group
  from public, anon;
revoke execute on function public.grant_premium from authenticated;
grant execute on function public.create_premium_invite, public.cancel_premium_invite,
  public.my_premium_invite, public.can_be_in_another_group
  to authenticated;
grant execute on function public.grant_premium to service_role;

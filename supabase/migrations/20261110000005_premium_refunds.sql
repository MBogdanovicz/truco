-- Refunds: a refunded or charged-back Google Play purchase removes the
-- premium it granted. The check-refunds Edge Function reads Google's
-- voided purchases every day and calls revoke_premium_purchase().
--
-- Refunded full purchase ("premium"): premium is removed and its unused
-- invites are cancelled. Friends who already bought with an invite keep
-- their premium (they paid for it).

alter table public.premium_purchases add column revoked_at timestamptz;

create function public.revoke_premium_purchase(p_token text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_p public.premium_purchases;
begin
  select * into v_p from public.premium_purchases
  where purchase_token = p_token and revoked_at is null
  for update;
  if not found then
    return;
  end if;

  update public.premium_purchases set revoked_at = now()
  where purchase_token = p_token;

  if v_p.product_id = 'premium' then
    delete from public.premium_invites
    where inviter_id = v_p.user_id and redeemed_by is null;
  end if;

  -- Premium stays only if another purchase of the account is still valid.
  if not exists (
    select 1 from public.premium_purchases
    where user_id = v_p.user_id and revoked_at is null
  ) then
    update public.profiles set is_premium = false where id = v_p.user_id;
  end if;
end;
$$;

revoke execute on function public.revoke_premium_purchase from public, anon, authenticated;
grant execute on function public.revoke_premium_purchase to service_role;

-- Only a full purchase that was not refunded allows sending invites.
create or replace function public.create_premium_invite(p_email text)
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
    where user_id = v_uid and product_id = 'premium' and revoked_at is null
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

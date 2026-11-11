-- Phase 3: "intimar" — call the members of a group to a room by push.
--
-- push_tokens: Firebase Cloud Messaging tokens of each device (the Android
-- app and the site), written by the app for the signed-in account.
-- summons: who called which group to which room, to limit how often (the
-- Edge Function "intimar" writes it and sends the pushes).

create table public.push_tokens (
  token text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null check (platform in ('android', 'web')),
  updated_at timestamptz not null default now()
);

create index push_tokens_user on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

create policy "own push tokens" on public.push_tokens
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- A token moves to whoever signs in on that device.
create function public.save_push_token(p_token text, p_platform text)
returns void
language sql security definer set search_path = ''
as $$
  insert into public.push_tokens (token, user_id, platform)
  select p_token, auth.uid(), p_platform
  where auth.uid() is not null
  on conflict (token) do update
    set user_id = excluded.user_id, platform = excluded.platform, updated_at = now();
$$;

revoke execute on function public.save_push_token from public, anon;
grant execute on function public.save_push_token to authenticated;

create table public.summons (
  id bigint generated always as identity primary key,
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  room_code text not null,
  kind text not null check (kind in ('game', 'scorekeeper')),
  sent int not null default 0,
  created_at timestamptz not null default now()
);

create index summons_recent on public.summons (user_id, group_id, created_at desc);

alter table public.summons enable row level security;
-- No policies: written and read by the Edge Function only.
revoke all on public.summons from anon, authenticated;

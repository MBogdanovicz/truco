-- Treinamento exams: passing the game at the end of a level unlocks
-- course_basic, course_intermediate or course_advanced; all three unlock
-- course_all ("Dominou a cartilha"). The game is played
-- against the computer on the device, so the app reports it; only these
-- three ids can be unlocked this way (low stakes: no ranking, no Elo).

create or replace function public.unlock_course_achievement(p_achievement text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if p_achievement not in ('course_basic', 'course_intermediate', 'course_advanced', 'course_all') then
    raise exception 'not a course achievement';
  end if;
  if p_achievement = 'course_all' and (
    select count(*) from public.achievements_unlocked
    where user_id = auth.uid()
      and achievement in ('course_basic', 'course_intermediate', 'course_advanced')
  ) < 3 then
    raise exception 'pass the three exams first';
  end if;
  if auth.uid() is null or not public.is_full_account() then
    raise exception 'full accounts only';
  end if;
  perform public._unlock(auth.uid(), p_achievement, null, now());
end;
$$;

revoke execute on function public.unlock_course_achievement from public, anon;
grant execute on function public.unlock_course_achievement to authenticated;

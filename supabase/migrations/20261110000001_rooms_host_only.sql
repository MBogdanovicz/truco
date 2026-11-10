-- Only the host can read its own room rows; everyone else finds a room
-- with find_open_room(). Run after every store build in use joins rooms
-- through find_open_room() (build 54 or later): older builds read the
-- table directly and would stop finding rooms by code.

drop policy "rooms are readable by signed-in users" on public.rooms;

create policy "hosts read their rooms"
  on public.rooms for select to authenticated using (host_id = auth.uid());

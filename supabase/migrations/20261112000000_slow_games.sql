-- Slow games ("partida lenta"): 4 people, days per move (rules.lento).
--
-- waiting_seat: the seat the game waits for, so the app can list "your
-- turn" without opening every game. Written by the game function; older
-- app versions ignore it. Safe to run more than once.

alter table public.game_rooms add column if not exists waiting_seat smallint;

create index if not exists game_rooms_slow_deadline on public.game_rooms (turn_deadline)
  where status = 'playing' and rules ? 'lento';

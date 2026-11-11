-- Online games: a time limit per move, and returning to a game in progress.
--
-- turn_deadline: when the person the game waits for runs out of time (the
-- moves still being shown plus 20 seconds). After it, any seated person's
-- app asks the server to let the computer move for them.
-- departed: seat each person left during the current game, so coming back
-- puts them in the same place (the computer plays it meanwhile).

alter table public.game_rooms add column turn_deadline timestamptz;
alter table public.game_states add column departed jsonb not null default '{}';

// Online card games in rooms, judged by the server.
//
// The app calls this with {action, ...}. The game itself runs in
// engine.js: the app's Dart engine compiled to JavaScript
// (app/tool/build_game_server.sh). A game's whole state is its rules, seed,
// first dealer, computer seats and action log (game_states, server only);
// every request replays the log, applies one action, lets the computer play
// until a person must act, and writes each person's frames to game_views,
// which the app follows over Realtime.
//
// Actions: create, join, sit, options, start (also rematch), act ({roomId,
// move: {t, c?, x?, i?}}), leave.
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// by the platform.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { Game, type Json, Refused } from "./game.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function reply(status: number, body: Json) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const asUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user } } = await asUser.auth.getUser();
    if (!user) return reply(401, { error: "not_authenticated" });

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const body = (await req.json()) as Json;
    const { data: profile } = await db.from("profiles").select("display_name")
      .eq("id", user.id).maybeSingle();
    const name = String(profile?.display_name ?? body.name ?? "Jogador").slice(0, 24);
    const game = new Game(db, user.id, user.is_anonymous ?? false, name);

    switch (body.action) {
      case "create":
        return reply(200, await game.create(body));
      case "join":
        return reply(200, await game.join(body));
      case "sit":
        return reply(200, await game.sit(body));
      case "options":
        return reply(200, await game.options(body));
      case "start":
        return reply(200, await game.start(body));
      case "act":
        return reply(200, await game.act(body));
      case "leave":
        return reply(200, await game.leave(body));
      default:
        return reply(400, { error: "unknown_action" });
    }
  } catch (e) {
    if (e instanceof Refused) return reply(400, { error: e.message });
    console.error(e);
    return reply(500, { error: "server_error" });
  }
});

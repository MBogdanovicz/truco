// Slow games ("partida lenta"): lets the computer move for whoever ran out
// of days. Tournaments: decides live matches past their deadline (W.O.). Nobody may have the game open, so a GitHub workflow calls this
// every hour (.github/workflows/game-sweep.yml).
//
// Deploy with: supabase functions deploy game-sweep --no-verify-jwt
// Secret: CRON_SECRET, shared with the workflow (header x-cron-secret), the
// same one check-refunds uses. FIREBASE_SERVICE_ACCOUNT_JSON for the pushes.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { Game } from "../game/game.ts";
import { Tournaments } from "../game/tournament.ts";

Deno.serve(async (req) => {
  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return new Response("forbidden", { status: 403 });
  }
  try {
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const result = {
      slow: await new Game(db, "", false, "").sweep(),
      tournaments: await new Tournaments(db, "", false, "").sweep(),
    };
    console.log("game-sweep", result);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response("server_error", { status: 500 });
  }
});

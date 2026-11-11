// "Intimar": calls the other members of a group to a room by push.
//
// The app calls this with {groupId, code, kind: 'game' | 'scorekeeper'}.
// It checks that the caller belongs to the group, limits how often one
// person may call the same group, and sends a Firebase Cloud Messaging push
// to every device of the other members (push_tokens). Tapping it opens the
// room's invite link.
//
// Secrets (supabase secrets set ...):
//   FIREBASE_SERVICE_ACCOUNT_JSON  key of a service account of the Firebase
//                                  project (Project settings > Service accounts)
//   WEB_APP_URL                    defaults to https://truco.mytrophies.app
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// by the platform.

import { createClient } from "jsr:@supabase/supabase-js@2";

const WEB_APP_URL = Deno.env.get("WEB_APP_URL") ?? "https://truco.mytrophies.app";

/** One call per person and group in this time. */
const COOLDOWN_MS = 60_000;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function base64url(data: ArrayBuffer | string): string {
  const bytes = typeof data === "string"
    ? new TextEncoder().encode(data)
    : new Uint8Array(data);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

function serviceAccount(): ServiceAccount {
  const sa = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON") ?? "{}");
  if (!sa.client_email || !sa.private_key || !sa.project_id) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }
  return sa;
}

/** OAuth access token for Firebase Cloud Messaging. */
async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claims}`),
  );
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${base64url(signature)}`,
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`Google token: ${JSON.stringify(json)}`);
  return json.access_token as string;
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
    if (!user || user.is_anonymous) return reply(401, { error: "account_required" });

    const body = await req.json();
    const groupId = String(body.groupId ?? "");
    const code = String(body.code ?? "").trim().toUpperCase();
    const kind = body.kind === "scorekeeper" ? "scorekeeper" : "game";
    if (!/^[A-Z0-9]{6}$/.test(code)) return reply(400, { error: "bad_code" });

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const [{ data: members }, { data: group }, { data: profile }, { data: last }] =
      await Promise.all([
        db.from("group_members").select("user_id").eq("group_id", groupId),
        db.from("groups").select("name").eq("id", groupId).maybeSingle(),
        db.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        db.from("summons").select("created_at").eq("user_id", user.id)
          .eq("group_id", groupId).order("created_at", { ascending: false })
          .limit(1).maybeSingle(),
      ]);
    if (!group || !members?.some((m) => m.user_id === user.id)) {
      return reply(403, { error: "not_member" });
    }
    if (last && Date.now() - Date.parse(last.created_at) < COOLDOWN_MS) {
      return reply(429, { error: "too_soon" });
    }

    const others = members.map((m) => m.user_id).filter((id) => id !== user.id);
    const { data: tokens } = others.length
      ? await db.from("push_tokens").select("token, platform").in("user_id", others)
      : { data: [] };

    const name = profile?.display_name ?? "Alguém";
    const title = kind === "game" ? "Bora jogar truco!" : "Bora marcar um truco!";
    const text = `${name} está intimando o grupo ${group.name} (sala ${code}).`;
    const path = kind === "game"
      ? `/jogo/entrar?codigo=${code}`
      : `/marcador/entrar?codigo=${code}`;
    const link = `${WEB_APP_URL}/sala/?codigo=${code}${kind === "game" ? "&jogo=1" : ""}`;

    let sent = 0;
    let failed = 0;
    if (tokens?.length) {
      const sa = serviceAccount();
      const bearer = await accessToken(sa);
      const dead: string[] = [];
      await Promise.all(tokens.map(async ({ token }) => {
        const res = await fetch(
          `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${bearer}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: {
                token,
                notification: { title, body: text },
                data: { path, link },
                android: { priority: "high", notification: { tag: `summon-${groupId}` } },
                webpush: { fcm_options: { link } },
              },
            }),
          },
        );
        if (res.ok) {
          sent++;
        } else {
          const err = await res.text();
          // The app was uninstalled or the token expired.
          if (res.status === 404 || err.includes("UNREGISTERED")) {
            dead.push(token);
          } else {
            failed++;
            console.error("FCM", res.status, err);
          }
        }
      }));
      if (dead.length) await db.from("push_tokens").delete().in("token", dead);
    }

    // Only a call that reached someone counts for the waiting time.
    if (sent > 0) {
      await db.from("summons").insert({
        group_id: groupId,
        user_id: user.id,
        room_code: code,
        kind,
        sent,
      });
    }
    return reply(200, { sent, failed, devices: tokens?.length ?? 0, members: others.length });
  } catch (e) {
    console.error(e);
    return reply(500, { error: "server_error" });
  }
});

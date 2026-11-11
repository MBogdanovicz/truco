// Firebase Cloud Messaging (HTTP v1) for the Edge Functions.
//
// Secret: FIREBASE_SERVICE_ACCOUNT_JSON (see intimar/index.ts).

import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";

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

export function serviceAccount(): ServiceAccount {
  const sa = JSON.parse(Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON") ?? "{}");
  if (!sa.client_email || !sa.private_key || !sa.project_id) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }
  return sa;
}

/** OAuth access token for Firebase Cloud Messaging. */
export async function accessToken(sa: ServiceAccount): Promise<string> {
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


export interface Push {
  title: string;
  body: string;
  /** Route the app opens when the push is tapped. */
  path: string;
  /** Web page the browser opens when the push is tapped. */
  link: string;
  /** Pushes with the same tag replace each other on Android. */
  tag: string;
}

/** Sends [push] to every device of [userIds]; drops dead tokens. Returns
 * how many devices got it. Never throws: a push is a bonus. */
export async function sendPush(
  db: SupabaseClient,
  userIds: string[],
  push: Push,
): Promise<number> {
  try {
    if (!userIds.length) return 0;
    const { data: tokens } = await db.from("push_tokens").select("token")
      .in("user_id", userIds);
    if (!tokens?.length) return 0;
    const sa = serviceAccount();
    const bearer = await accessToken(sa);
    const dead: string[] = [];
    let sent = 0;
    await Promise.all(tokens.map(async ({ token }: { token: string }) => {
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
              notification: { title: push.title, body: push.body },
              data: { path: push.path, link: push.link },
              android: { priority: "high", notification: { tag: push.tag } },
              webpush: { fcm_options: { link: push.link } },
            },
          }),
        },
      );
      if (res.ok) {
        sent++;
      } else {
        const err = await res.text();
        if (res.status === 404 || err.includes("UNREGISTERED")) dead.push(token);
        else console.error("FCM", res.status, err.slice(0, 300));
      }
    }));
    if (dead.length) await db.from("push_tokens").delete().in("token", dead);
    return sent;
  } catch (e) {
    console.error("push", e);
    return 0;
  }
}

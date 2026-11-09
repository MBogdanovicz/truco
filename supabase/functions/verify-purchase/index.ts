// Verifies a Google Play one-time purchase and turns premium on for the
// signed-in account.
//
// The app calls this right after a purchase (and on "restore purchases").
// It asks Google whether the token is a real, completed purchase of our
// product, acknowledges it (unacknowledged purchases are refunded after 3
// days) and records it with public.grant_premium, which is idempotent.
//
// Secrets (supabase secrets set ...):
//   GOOGLE_SERVICE_ACCOUNT_JSON  key of a service account with access to the
//                                app in Play Console (financial data / orders)
//   ANDROID_PACKAGE_NAME         defaults to app.mytrophies.truco
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// by the platform.

import { createClient } from "jsr:@supabase/supabase-js@2";

const PRODUCTS = new Set(["premium", "premium_invite"]);
const PACKAGE = Deno.env.get("ANDROID_PACKAGE_NAME") ?? "app.mytrophies.truco";

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

/** OAuth access token for the Play Developer API from a service account. */
async function googleAccessToken(): Promise<string> {
  const sa = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON") ?? "{}");
  if (!sa.client_email || !sa.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");
  }
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const pem = (sa.private_key as string)
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s+/g, "");
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
  if (!res.ok) throw new Error(`google token: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply(405, { error: "method_not_allowed" });

  // Who is asking (the app sends the user's session token).
  const auth = req.headers.get("Authorization") ?? "";
  const asUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: auth } } },
  );
  const { data: { user } } = await asUser.auth.getUser();
  if (!user || user.is_anonymous) return reply(401, { error: "not_signed_in" });

  let productId: string, purchaseToken: string;
  try {
    ({ productId, purchaseToken } = await req.json());
  } catch {
    return reply(400, { error: "bad_request" });
  }
  if (!PRODUCTS.has(productId) || typeof purchaseToken !== "string" || !purchaseToken) {
    return reply(400, { error: "bad_request" });
  }

  try {
    const token = await googleAccessToken();
    const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/` +
      `${PACKAGE}/purchases/products/${productId}/tokens/${encodeURIComponent(purchaseToken)}`;
    const res = await fetch(base, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404 || res.status === 400) return reply(400, { error: "invalid_purchase" });
    if (!res.ok) throw new Error(`play get: ${res.status} ${await res.text()}`);
    const purchase = await res.json();
    // 0 purchased, 1 cancelled, 2 pending.
    if (purchase.purchaseState === 2) return reply(202, { status: "pending" });
    if (purchase.purchaseState !== 0) return reply(400, { error: "not_purchased" });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await admin.rpc("grant_premium", {
      p_user: user.id,
      p_product: productId,
      p_token: purchaseToken,
      p_order: purchase.orderId ?? null,
    });
    if (error) {
      const known = ["token_used", "no_invite"].find((e) => error.message.includes(e));
      if (known) return reply(409, { error: known });
      throw new Error(`grant_premium: ${error.message}`);
    }

    if (purchase.acknowledgementState === 0) {
      const ack = await fetch(`${base}:acknowledge`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
      });
      if (!ack.ok) console.error("acknowledge failed", ack.status, await ack.text());
    }
    return reply(200, { status: "premium" });
  } catch (e) {
    console.error(e);
    return reply(500, { error: "server_error" });
  }
});

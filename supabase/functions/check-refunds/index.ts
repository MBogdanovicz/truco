// Removes premium from refunded Google Play purchases.
//
// Called once a day by .github/workflows/supabase-keepalive.yml. Lists the
// purchases Google voided in the last 30 days (refunds, chargebacks,
// cancellations) and calls public.revoke_premium_purchase for each token.
// Unknown tokens are ignored, so running it again is harmless.
//
// Deploy with: supabase functions deploy check-refunds --no-verify-jwt
// Secrets:
//   CRON_SECRET                  shared with the GitHub workflow (header
//                                x-cron-secret); nobody else can call it
//   GOOGLE_SERVICE_ACCOUNT_JSON  same as verify-purchase; the account needs
//                                the "View financial data" permission
//   ANDROID_PACKAGE_NAME         defaults to app.mytrophies.truco

import { createClient } from "jsr:@supabase/supabase-js@2";

const PACKAGE = Deno.env.get("ANDROID_PACKAGE_NAME") ?? "app.mytrophies.truco";

// Same as in verify-purchase.
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
  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return new Response("forbidden", { status: 403 });
  }
  try {
    const token = await googleAccessToken();
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    // Google keeps 30 days; asking for exactly 30 is refused at the edge.
    const since = Date.now() - 29 * 24 * 3600 * 1000;
    let pageToken: string | undefined;
    let voided = 0;
    do {
      const url = new URL(
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE}/purchases/voidedpurchases`,
      );
      url.searchParams.set("startTime", String(since));
      url.searchParams.set("maxResults", "1000");
      if (pageToken) url.searchParams.set("token", pageToken);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`voided purchases: ${res.status} ${await res.text()}`);
      const body = await res.json();
      for (const v of body.voidedPurchases ?? []) {
        voided++;
        const { error } = await admin.rpc("revoke_premium_purchase", {
          p_token: v.purchaseToken,
        });
        if (error) throw new Error(`revoke_premium_purchase: ${error.message}`);
      }
      pageToken = body.tokenPagination?.nextPageToken;
    } while (pageToken);
    return Response.json({ voided });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
});

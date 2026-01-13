import { randomUUID } from "crypto";

import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

function section(title: string) {
  console.log("");
  console.log(title);
  console.log("-".repeat(title.length));
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  // Supabase keys are JWTs. We only decode payload to sanity-check the role claim.
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payloadB64 = parts[1] ?? "";
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;
    return payload;
  } catch {
    return null;
  }
}

function supabaseKeyRole(key: string): string | null {
  const payload = decodeJwtPayload(key);
  const role = payload?.role;
  return typeof role === "string" ? role : null;
}

async function verifySupabase() {
  section("Supabase");

  const { serverEnv } = await import("@/lib/env/server");
  const url = serverEnv.SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("disabled (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
    return;
  }

  const role = supabaseKeyRole(key);
  if (role && role !== "service_role") {
    throw new Error(
      `Supabase key role is '${role}'. This script expects the 'service_role' key (Project Settings → API → service_role).`,
    );
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // 1) Table exists
  const exists = await supabase
    .from("waitlist_submissions")
    .select("id")
    .limit(1);

  if (exists.error) {
    const code = (exists.error as { code?: unknown }).code;
    throw new Error(
      `Supabase table check failed: ${exists.error.message}${code ? ` (code=${String(code)})` : ""}`,
    );
  }
  console.log("table: ok");

  // 2) Write
  const id = randomUUID();
  const email = `verify+${id.slice(0, 8)}@example.com`;
  const insert = await supabase.from("waitlist_submissions").insert({
    id,
    email,
    name: "verify",
    message: "verify-integrations",
    metadata: { source: "verify-integrations" },
  });

  if (insert.error) {
    throw new Error(`Supabase insert failed: ${insert.error.message}`);
  }
  console.log("write: ok");

  // 3) Read
  const read = await supabase
    .from("waitlist_submissions")
    .select("id,email")
    .eq("id", id)
    .maybeSingle();

  if (read.error) {
    throw new Error(`Supabase read failed: ${read.error.message}`);
  }
  if (!read.data?.id) {
    throw new Error("Supabase read failed: inserted row not found");
  }
  console.log("read: ok");

  // Cleanup (best-effort)
  await supabase.from("waitlist_submissions").delete().eq("id", id);
}

async function verifySanity() {
  section("Sanity");

  const { serverEnv } = await import("@/lib/env/server");

  const enabled =
    Boolean(serverEnv.SANITY_PROJECT_ID) &&
    Boolean(serverEnv.SANITY_DATASET) &&
    Boolean(serverEnv.SANITY_API_VERSION);

  if (!enabled) {
    console.log("disabled (missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_VERSION)");
    return;
  }

  const query = encodeURIComponent(`*[_type=="landing"][0]{heroTitle,heroSubtitle}`);
  const url = `https://${serverEnv.SANITY_PROJECT_ID}.api.sanity.io/v${serverEnv.SANITY_API_VERSION}/data/query/${serverEnv.SANITY_DATASET}?query=${query}`;
  const res = await fetch(url, {
    headers: serverEnv.SANITY_READ_TOKEN
      ? { Authorization: `Bearer ${serverEnv.SANITY_READ_TOKEN}` }
      : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Sanity fetch failed: ${res.status} ${res.statusText}. If your dataset is private, set SANITY_READ_TOKEN (Viewer). Response: ${text.slice(
        0,
        200,
      )}`,
    );
  }

  const json = (await res.json()) as { result?: { heroTitle?: string; heroSubtitle?: string } | null };
  const content = json.result ?? null;
  if (!content) {
    throw new Error(
      "Sanity returned no `landing` document. Create one with fields `heroTitle` and/or `heroSubtitle`, then publish it.",
    );
  }

  console.log("fetch: ok");
  console.log("- heroTitle:", content.heroTitle ?? "(missing)");
  console.log("- heroSubtitle:", content.heroSubtitle ?? "(missing)");
}

async function verifyPostHog() {
  section("PostHog");

  const { clientEnv } = await import("@/lib/env/client");
  const apiKey = clientEnv.NEXT_PUBLIC_POSTHOG_KEY;
  const host = clientEnv.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

  if (!apiKey) {
    console.log("disabled (missing NEXT_PUBLIC_POSTHOG_KEY)");
    return;
  }

  // Server-side test event (lets us verify without relying on browser DevTools)
  const distinctId = `verify-${randomUUID()}`;
  const res = await fetch(`${host.replace(/\/$/, "")}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event: "verify_integrations",
      distinct_id: distinctId,
      properties: {
        source: "verify-integrations",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PostHog capture failed: ${res.status} ${res.statusText} ${text}`);
  }

  console.log("capture: ok (sent `verify_integrations`)");
  console.log("next: submit the waitlist on `/` and confirm `waitlist_submitted` appears in PostHog.");
}

async function main() {
  console.log("Verify integrations");
  console.log("(Only enabled integrations are checked; missing env => skipped.)");

  const failures: string[] = [];

  for (const fn of [verifySupabase, verifySanity, verifyPostHog]) {
    try {
      await fn();
    } catch (e) {
      failures.push(e instanceof Error ? e.message : String(e));
    }
  }

  console.log("");
  if (failures.length > 0) {
    console.error("FAILED:");
    for (const msg of failures) console.error("-", msg);
    process.exit(1);
  }

  console.log("OK: integrations look healthy.");
}

main().catch((e) => {
  console.error("");
  console.error("FAILED:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});


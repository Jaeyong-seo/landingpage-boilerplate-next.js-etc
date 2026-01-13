import { NextRequest } from "next/server";

import { notifyDiscordNewWaitlist } from "@/lib/notify/discord";
import { getRequestIp } from "@/lib/request-ip";
import { WaitlistSubmissionSchema } from "@/lib/waitlist/schema";
import { RateLimitError, rateLimitOrThrow } from "@/lib/waitlist/rate-limit";
import { getWaitlistStore } from "@/lib/waitlist/store";
import { demoWaitlistStore } from "@/lib/waitlist/store-demo";

function isMissingSupabaseTableError(e: unknown) {
  const code = (e as { code?: unknown }).code;
  return code === "PGRST205";
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req);

  try {
    rateLimitOrThrow({ key: `waitlist:${ip}`, limit: 5, windowMs: 60_000 });
  } catch (e: unknown) {
    if (e instanceof RateLimitError) {
      const retryAfter = Number(e.retryAfterSec ?? 60);
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
    throw e;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = WaitlistSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const input = parsed.data;

  // Honeypot: if this is filled, silently accept to reduce bot feedback.
  if (input.companyWebsite && input.companyWebsite.trim().length > 0) {
    return Response.json({ ok: true, status: "accepted" });
  }

  const store = getWaitlistStore();
  const payload = {
    email: input.email,
    name: input.name,
    message: input.message,
    metadata: input.metadata ? { ...input.metadata } : undefined,
  };

  let result: Awaited<ReturnType<typeof store.add>>;
  try {
    result = await store.add(payload);
  } catch (e: unknown) {
    // Optional integration: if Supabase is configured but not fully set up (e.g. table missing),
    // fall back to demo storage so local/dev still works.
    if (isMissingSupabaseTableError(e)) {
      result = await demoWaitlistStore.add(payload);
    } else {
      throw e;
    }
  }

  if (result.status === "duplicate") {
    return Response.json({ ok: false, error: "duplicate" }, { status: 409 });
  }

  if (result.submission) {
    void notifyDiscordNewWaitlist(result.submission);
  }

  return Response.json({ ok: true, status: "created", submission: result.submission });
}


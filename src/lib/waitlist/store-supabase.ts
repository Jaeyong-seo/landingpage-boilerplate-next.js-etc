import { randomUUID } from "crypto";

import { createClient } from "@supabase/supabase-js";

import { serverEnv } from "@/lib/env/server";
import type { WaitlistStore } from "@/lib/waitlist/types";

/**
 * Expected table (example):
 * - waitlist_submissions(id uuid primary key, email text unique not null, name text, message text, created_at timestamptz default now(), metadata jsonb)
 */
export function supabaseWaitlistStore(): WaitlistStore {
  const url = serverEnv.SUPABASE_URL;
  const serviceRoleKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase env is not configured.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return {
    async add(input) {
      const id = randomUUID();
      const createdAt = new Date().toISOString();
      const email = input.email.toLowerCase();

      const { error } = await supabase.from("waitlist_submissions").insert({
        id,
        email,
        name: input.name ?? null,
        message: input.message ?? null,
        created_at: createdAt,
        metadata: input.metadata ?? null,
      });

      if (error) {
        // Unique violation in Postgres.
        const code = (error as { code?: unknown }).code;
        if (code === "23505") {
          return { status: "duplicate" as const };
        }
        throw error;
      }

      return {
        status: "created" as const,
        submission: {
          id,
          email,
          name: input.name,
          message: input.message,
          createdAt,
          metadata: input.metadata,
        },
      };
    },

    async listRecent(limit) {
      const { data, error } = await supabase
        .from("waitlist_submissions")
        .select("id,email,name,message,created_at,metadata")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const rows = (data ?? []) as Array<Record<string, unknown>>;
      return rows.map((row) => ({
        id: String(row.id),
        email: String(row.email),
        name: (row.name ?? undefined) as string | undefined,
        message: (row.message ?? undefined) as string | undefined,
        createdAt: String(row.created_at),
        metadata: (row.metadata ?? undefined) as Record<string, string | undefined> | undefined,
      }));
    },
  };
}


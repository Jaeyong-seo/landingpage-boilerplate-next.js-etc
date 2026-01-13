import { serverEnv } from "@/lib/env/server";
import type { WaitlistSubmission } from "@/lib/waitlist/types";

export async function notifyDiscordNewWaitlist(submission: WaitlistSubmission) {
  const url = serverEnv.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const content = [
    "**New waitlist submission**",
    `- email: ${submission.email}`,
    submission.name ? `- name: ${submission.name}` : null,
    submission.message ? `- message: ${submission.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch {
    // Optional integration: never fail the core request.
  }
}


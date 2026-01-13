import { randomUUID } from "crypto";

import type { WaitlistStore, WaitlistSubmission } from "@/lib/waitlist/types";

const emails = new Set<string>();
const submissions: WaitlistSubmission[] = [];

export const demoWaitlistStore: WaitlistStore = {
  async add(input) {
    const email = input.email.toLowerCase();
    if (emails.has(email)) {
      return { status: "duplicate" as const };
    }

    const submission: WaitlistSubmission = {
      id: randomUUID(),
      email,
      name: input.name,
      message: input.message,
      createdAt: new Date().toISOString(),
      metadata: input.metadata,
    };

    emails.add(email);
    submissions.unshift(submission);
    return { status: "created" as const, submission };
  },

  async listRecent(limit) {
    return submissions.slice(0, limit);
  },
};


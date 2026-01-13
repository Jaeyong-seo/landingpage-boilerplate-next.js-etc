export type WaitlistSubmission = {
  id: string;
  email: string;
  name?: string;
  message?: string;
  createdAt: string;
  metadata?: Record<string, string | undefined>;
};

export type WaitlistStore = {
  add: (submission: Omit<WaitlistSubmission, "id" | "createdAt">) => Promise<{
    status: "created" | "duplicate";
    submission?: WaitlistSubmission;
  }>;
  listRecent: (limit: number) => Promise<WaitlistSubmission[]>;
};


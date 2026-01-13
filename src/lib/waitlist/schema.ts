import { z } from "zod";

export const WaitlistSubmissionSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(80).optional(),
  message: z.string().trim().max(500).optional(),

  // Honeypot (bots often fill hidden fields).
  companyWebsite: z.string().optional(),

  metadata: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
    })
    .optional(),
});

export type WaitlistSubmissionInput = z.infer<typeof WaitlistSubmissionSchema>;


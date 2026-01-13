import { z } from "zod";

const ServerEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),

    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

    DISCORD_WEBHOOK_URL: z.string().url().optional(),

    SANITY_PROJECT_ID: z.string().min(1).optional(),
    SANITY_DATASET: z.string().min(1).optional(),
    SANITY_API_VERSION: z.string().min(1).optional(),
    SANITY_READ_TOKEN: z.string().min(1).optional(),

    ADMIN_TOKEN: z.string().min(1).optional(),
  })
  .passthrough();

export const serverEnv = ServerEnvSchema.parse(process.env);


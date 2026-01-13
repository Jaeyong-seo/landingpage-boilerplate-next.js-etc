import { clientEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";

export type Diagnostics = ReturnType<typeof diagnostics>;

export function diagnostics() {
  const hasSupabase =
    Boolean(serverEnv.SUPABASE_URL) && Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY);

  const hasDiscord = Boolean(serverEnv.DISCORD_WEBHOOK_URL);

  const hasPosthog = Boolean(clientEnv.NEXT_PUBLIC_POSTHOG_KEY);

  const hasSanity =
    Boolean(serverEnv.SANITY_PROJECT_ID) &&
    Boolean(serverEnv.SANITY_DATASET) &&
    Boolean(serverEnv.SANITY_API_VERSION);

  const hasAdmin = Boolean(serverEnv.ADMIN_TOKEN);

  return {
    integrations: {
      supabase: { enabled: hasSupabase },
      discord: { enabled: hasDiscord },
      posthog: { enabled: hasPosthog },
      sanity: { enabled: hasSanity },
      admin: { enabled: hasAdmin },
    },
  };
}


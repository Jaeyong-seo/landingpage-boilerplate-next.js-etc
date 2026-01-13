import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

function formatBool(value: boolean) {
  return value ? "enabled" : "disabled";
}

function main() {
  // Load env after Next-style dotenv resolution.
  // Import env-dependent modules lazily so they see populated process.env.
  void 0;

  Promise.resolve()
    .then(async () => {
      const { serverEnv } = await import("@/lib/env/server");
      const { diagnostics } = await import("@/lib/diagnostics");

      // Force schema parse early (throws with clear message if format is invalid).
      void serverEnv;

      const d = diagnostics();

      console.log("Env verification");
      console.log("- supabase:", formatBool(d.integrations.supabase.enabled));
      console.log("- discord:", formatBool(d.integrations.discord.enabled));
      console.log("- posthog:", formatBool(d.integrations.posthog.enabled));
      console.log("- sanity:", formatBool(d.integrations.sanity.enabled));
      console.log("- admin:", formatBool(d.integrations.admin.enabled));
      console.log("");
      console.log("OK: env format looks valid.");
      console.log("Tip: run `npm run dev` then check `GET /api/health` and `GET /api/diagnostics`.");
    })
    .catch((e) => {
      console.error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    });
}

main();


import { diagnostics } from "@/lib/diagnostics";
import { demoWaitlistStore } from "@/lib/waitlist/store-demo";
import { supabaseWaitlistStore } from "@/lib/waitlist/store-supabase";
import type { WaitlistStore } from "@/lib/waitlist/types";

export function getWaitlistStore(): WaitlistStore {
  const d = diagnostics();
  if (d.integrations.supabase.enabled) {
    return supabaseWaitlistStore();
  }
  return demoWaitlistStore;
}


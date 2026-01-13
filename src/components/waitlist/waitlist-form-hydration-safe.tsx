"use client";

import { useSyncExternalStore } from "react";

import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export function WaitlistFormHydrationSafe() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="h-[420px] w-full rounded-xl border bg-card p-6 text-card-foreground"
      />
    );
  }

  return <WaitlistForm />;
}


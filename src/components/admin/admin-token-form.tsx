"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminTokenForm() {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionUrl = useMemo(() => {
    if (typeof window === "undefined") return "/admin";
    return window.location.pathname;
  }, []);

  return (
    <form
      action={actionUrl}
      className="flex w-full max-w-sm gap-2"
      onSubmit={() => setIsSubmitting(true)}
    >
      <Input
        name="token"
        placeholder="Admin token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <Button disabled={isSubmitting || token.length === 0} type="submit">
        Enter
      </Button>
    </form>
  );
}


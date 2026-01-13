"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WaitlistSubmissionSchema } from "@/lib/waitlist/schema";

import posthog from "posthog-js";

const WaitlistFormSchema = WaitlistSubmissionSchema.pick({
  email: true,
  name: true,
  message: true,
  companyWebsite: true,
});

type WaitlistFormValues = z.infer<typeof WaitlistFormSchema>;

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = url.searchParams.get(key);
    if (value) out[key] = value;
  }
  return out;
}

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo<WaitlistFormValues>(
    () => ({ email: "", name: "", message: "", companyWebsite: "" }),
    [],
  );

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(WaitlistFormSchema),
    defaultValues,
  });

  async function onSubmit(values: WaitlistFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          metadata: getUtmParams(),
        }),
      });

      if (res.status === 409) {
        toast.error("You’re already on the list.");
        return;
      }

      if (!res.ok) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      posthog.capture("waitlist_submitted", {
        email_domain: values.email.split("@")[1] ?? "unknown",
      });
      toast.success("You’re on the list. Thanks!");
      form.reset(defaultValues);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the waiting list</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What are you building?" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Honeypot: hidden from users, visible to simple bots */}
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <div className="hidden">
                  <input autoComplete="off" tabIndex={-1} {...field} />
                </div>
              )}
            />

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Join"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


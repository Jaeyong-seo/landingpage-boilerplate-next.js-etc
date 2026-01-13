import { WaitlistFormHydrationSafe } from "@/components/waitlist/waitlist-form-hydration-safe";
import { FlowDiagram } from "@/components/landing/flow-diagram";
import { SetupChecklist } from "@/components/landing/setup-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { diagnostics } from "@/lib/diagnostics";
import { fetchSanityLandingContent } from "@/lib/cms/sanity";
import { BarChart3, Bell, Database, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import type { ReactNode } from "react";

export default async function Home() {
  const d = diagnostics();
  const sanity = await fetchSanityLandingContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-6 py-16 dark:from-black dark:to-zinc-950">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <header className="flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
            Landing & Waitlist Boilerplate
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href="#features">
              Features
            </a>
            <a className="hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="hover:text-foreground" href="#setup">
              Setup
            </a>
            <a className="hover:text-foreground" href="#waitlist">
              Waitlist
            </a>
          </nav>
        </header>

        <Hero sanity={sanity} />

        <section className="grid gap-8 lg:grid-cols-2">
          <div id="waitlist" className="scroll-mt-24">
            <WaitlistFormHydrationSafe />
          </div>
          <div className="space-y-6">
            <SetupChecklist diagnostics={d} />
            <Card>
              <CardHeader>
                <CardTitle>Quick verify</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <code className="rounded bg-muted px-2 py-1">npm run verify</code>
                </div>
                <div>
                  <code className="rounded bg-muted px-2 py-1">GET /api/health</code>
                </div>
                <div>
                  <code className="rounded bg-muted px-2 py-1">GET /api/diagnostics</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">What you get</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Waitlist collection"
              desc="React Hook Form + Zod validation shared across client/server."
              icon={<Zap className="h-5 w-5" />}
            />
            <Feature
              title="Spam guards"
              desc="Duplicate email prevention + honeypot + lightweight rate limit."
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <Feature
              title="Storage (optional)"
              desc="Demo mode by default, Supabase storage when configured."
              icon={<Database className="h-5 w-5" />}
            />
            <Feature
              title="Notifications (optional)"
              desc="Discord webhook on new submissions (never blocks core flow)."
              icon={<Bell className="h-5 w-5" />}
            />
            <Feature
              title="Analytics (optional)"
              desc="PostHog client init + event capture on submission."
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <Feature
              title="Minimal admin"
              desc="Token-gated, server-side list view for early operators."
              icon={<LayoutDashboard className="h-5 w-5" />}
            />
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24">
          <FlowDiagram />
        </section>

        <section id="setup" className="scroll-mt-24 space-y-3 text-sm text-muted-foreground">
          <p>
            All integrations are optional. You can run locally with no env set, then
            enable pieces incrementally.
          </p>
          <p>
            (Sanity content fetch is also optional; if you have a `landing` document, the
            hero can be CMS-driven.)
          </p>
        </section>

        <footer className="border-t pt-8 text-sm text-muted-foreground">
          Built for fast launch, validation, and simple operations.
        </footer>
      </div>
    </div>
  );
}

function Hero({ sanity }: { sanity: Awaited<ReturnType<typeof fetchSanityLandingContent>> }) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
      <div className="space-y-4">
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {sanity?.heroTitle ?? "Ship a landing + waitlist in a day, not a week."}
        </h1>
        <p className="text-pretty text-muted-foreground">
          {sanity?.heroSubtitle ??
            "A lightweight boilerplate focused on real operations: collecting leads, basic spam prevention, optional storage, notifications, analytics, and a minimal admin view."}
        </p>
        <div className="text-sm text-muted-foreground">
          Start here: <code className="rounded bg-muted px-2 py-1">npm run dev</code>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Designed for early-stage teams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>Single repo. App Router. Server Components. Simple defaults.</div>
          <div>Optional integrations that don’t block local/dev flow.</div>
          <div>Clear verification steps so you know what’s working.</div>
        </CardContent>
      </Card>
    </section>
  );
}

function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}

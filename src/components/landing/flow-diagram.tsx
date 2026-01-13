import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FlowDiagram() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How it works</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          aria-label="Waitlist data flow"
          className="h-auto w-full"
          viewBox="0 0 920 220"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {/* nodes */}
          <g className="[&_*]:stroke-zinc-300 dark:[&_*]:stroke-zinc-700 [&_*]:fill-white dark:[&_*]:fill-zinc-950">
            <rect x="20" y="80" rx="12" width="150" height="60" />
            <rect x="220" y="80" rx="12" width="170" height="60" />
            <rect x="440" y="40" rx="12" width="200" height="60" />
            <rect x="440" y="120" rx="12" width="200" height="60" />
            <rect x="690" y="20" rx="12" width="210" height="60" />
            <rect x="690" y="90" rx="12" width="210" height="60" />
            <rect x="690" y="160" rx="12" width="210" height="60" />
          </g>

          {/* arrows */}
          <g className="[&_*]:stroke-zinc-400 dark:[&_*]:stroke-zinc-600 [&_*]:fill-zinc-400 dark:[&_*]:fill-zinc-600">
            <line x1="170" y1="110" x2="220" y2="110" markerEnd="url(#arrow)" />
            <line x1="390" y1="110" x2="440" y2="70" markerEnd="url(#arrow)" />
            <line x1="390" y1="110" x2="440" y2="150" markerEnd="url(#arrow)" />

            <line x1="640" y1="70" x2="690" y2="50" markerEnd="url(#arrow)" />
            <line x1="640" y1="70" x2="690" y2="120" markerEnd="url(#arrow)" />
            <line x1="640" y1="150" x2="690" y2="190" markerEnd="url(#arrow)" />
          </g>

          {/* labels */}
          <g className="fill-zinc-950 text-[14px] font-medium dark:fill-zinc-50">
            <text x="95" y="115" textAnchor="middle">
              User
            </text>
            <text x="305" y="115" textAnchor="middle">
              Landing + Form
            </text>
            <text x="540" y="75" textAnchor="middle">
              API + Validation
            </text>
            <text x="540" y="155" textAnchor="middle">
              Spam Guards
            </text>
            <text x="795" y="55" textAnchor="middle">
              Store (Supabase)
            </text>
            <text x="795" y="125" textAnchor="middle">
              Notify (Discord)
            </text>
            <text x="795" y="195" textAnchor="middle">
              Track (PostHog)
            </text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}


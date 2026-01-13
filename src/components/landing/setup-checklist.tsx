import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Diagnostics } from "@/lib/diagnostics";

function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "default" : "secondary"}>
      {enabled ? "Enabled" : "Disabled"}
    </Badge>
  );
}

export function SetupChecklist({ diagnostics }: { diagnostics: Diagnostics }) {
  const i = diagnostics.integrations;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="text-muted-foreground">Supabase storage</div>
          <StatusBadge enabled={i.supabase.enabled} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-muted-foreground">Discord notifications</div>
          <StatusBadge enabled={i.discord.enabled} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-muted-foreground">PostHog analytics</div>
          <StatusBadge enabled={i.posthog.enabled} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-muted-foreground">Sanity content</div>
          <StatusBadge enabled={i.sanity.enabled} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-muted-foreground">Admin token</div>
          <StatusBadge enabled={i.admin.enabled} />
        </div>
      </CardContent>
    </Card>
  );
}


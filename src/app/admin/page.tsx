import { AdminTokenForm } from "@/components/admin/admin-token-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { serverEnv } from "@/lib/env/server";
import { getWaitlistStore } from "@/lib/waitlist/store";
import { demoWaitlistStore } from "@/lib/waitlist/store-demo";

function isMissingSupabaseTableError(e: unknown) {
  const code = (e as { code?: unknown }).code;
  return code === "PGRST205";
}

async function listRecentSafe(limit: number) {
  const store = getWaitlistStore();
  try {
    return await store.listRecent(limit);
  } catch (e: unknown) {
    if (isMissingSupabaseTableError(e)) {
      return await demoWaitlistStore.listRecent(limit);
    }
    throw e;
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = searchParams;
  const configuredToken = serverEnv.ADMIN_TOKEN;

  if (!configuredToken) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Admin is disabled.</p>
            <p>
              Set <code className="rounded bg-muted px-2 py-1">ADMIN_TOKEN</code> to enable
              token-gated access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tokenParam = typeof params.token === "string" ? params.token : "";
  const isAuthed = tokenParam.length > 0 && tokenParam === configuredToken;

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your admin token to view submissions.
            </p>
            <AdminTokenForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const limit = 50;

  const submissions = await listRecentSafe(limit);
  const filtered = q
    ? submissions.filter((s) => {
        const haystack = `${s.email} ${s.name ?? ""} ${s.message ?? ""}`.toLowerCase();
        return haystack.includes(q);
      })
    : submissions;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <div className="text-sm text-muted-foreground">
            Recent submissions <Badge variant="secondary">{filtered.length}</Badge>
          </div>
        </div>

        <form className="flex items-center gap-2">
          <input name="token" type="hidden" value={tokenParam} />
          <input
            className="h-10 w-64 rounded-md border bg-background px-3 text-sm"
            name="q"
            placeholder="Search email / name / message"
            defaultValue={q}
          />
          <button className="h-10 rounded-md bg-foreground px-4 text-sm text-background">
            Search
          </button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest {Math.min(limit, filtered.length)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="whitespace-nowrap">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.email}</TableCell>
                      <TableCell>{s.name ?? "-"}</TableCell>
                      <TableCell className="max-w-[440px] truncate">
                        {s.message ?? "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(s.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


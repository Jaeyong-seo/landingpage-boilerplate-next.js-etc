import { diagnostics } from "@/lib/diagnostics";

export function GET() {
  return Response.json(diagnostics());
}


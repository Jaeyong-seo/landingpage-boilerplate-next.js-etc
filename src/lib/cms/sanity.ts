import { serverEnv } from "@/lib/env/server";

export type SanityLandingContent = {
  heroTitle?: string;
  heroSubtitle?: string;
};

export async function fetchSanityLandingContent(): Promise<SanityLandingContent | null> {
  const projectId = serverEnv.SANITY_PROJECT_ID;
  const dataset = serverEnv.SANITY_DATASET;
  const apiVersion = serverEnv.SANITY_API_VERSION;
  const token = serverEnv.SANITY_READ_TOKEN;

  if (!projectId || !dataset || !apiVersion) return null;

  const query = encodeURIComponent(`*[_type=="landing"][0]{heroTitle,heroSubtitle}`);
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { result?: SanityLandingContent | null };
  return json.result ?? null;
}


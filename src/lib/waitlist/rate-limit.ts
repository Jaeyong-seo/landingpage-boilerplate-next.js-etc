type Bucket = { count: number; resetAtMs: number };

const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  retryAfterSec: number;

  constructor(retryAfterSec: number) {
    super("rate_limited");
    this.retryAfterSec = retryAfterSec;
  }
}

export function rateLimitOrThrow(opts: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const current = buckets.get(opts.key);

  if (!current || current.resetAtMs <= now) {
    buckets.set(opts.key, { count: 1, resetAtMs: now + opts.windowMs });
    return;
  }

  current.count += 1;
  if (current.count > opts.limit) {
    const retryAfterSec = Math.ceil((current.resetAtMs - now) / 1000);
    throw new RateLimitError(retryAfterSec);
  }
}


// Server only. Minimal Upstash Redis REST client (works with Vercel's Upstash integration env names too).
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisReady = Boolean(URL_ && TOKEN);

export async function redis<T = unknown>(...command: (string | number)[]): Promise<T> {
  if (!URL_ || !TOKEN) throw new Error("Redis is not configured");
  const res = await fetch(URL_, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(command.map(String)),
    cache: "no-store",
  });
  const body = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || body.error) throw new Error(body.error || `Redis HTTP ${res.status}`);
  return body.result as T;
}

/** Redis returns hashes as [k1, v1, k2, v2, ...]. */
export function toObject(flat: string[] | null | undefined): Record<string, string> {
  const o: Record<string, string> = {};
  if (!flat) return o;
  for (let i = 0; i + 1 < flat.length; i += 2) o[flat[i]] = flat[i + 1];
  return o;
}

/** Many commands in one request. */
export async function redisPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  if (!URL_ || !TOKEN) throw new Error("Redis is not configured");
  if (commands.length === 0) return [];
  const res = await fetch(`${URL_.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(commands.map((c) => c.map(String))),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis HTTP ${res.status}`);
  const body = (await res.json()) as { result?: unknown; error?: string }[];
  return body.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

import { NextResponse, type NextRequest } from "next/server";

import { redis, redisReady, toObject } from "@/lib/redis";
import { HANDLE_RE, TASK_IDS, WAITLIST, WALLET_RE, parseReplyUrl, points, type Entry } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });

// Everything happens in one atomic script, so two people can never get the same spot
// and one wallet, X account or reply link can only be used once.
const JOIN = `
local hk = 'yoha:wl:h:' .. ARGV[1]
if redis.call('EXISTS', hk) == 1 then
  if redis.call('HGET', hk, 'wallet_lc') == ARGV[3] then return 'existing' end
  return 'err:handle'
end
if redis.call('EXISTS', 'yoha:wl:w:' .. ARGV[3]) == 1 then return 'err:wallet' end
if redis.call('EXISTS', 'yoha:wl:reply:' .. ARGV[6]) == 1 then return 'err:reply' end
if redis.call('EXISTS', 'yoha:wl:ref:' .. ARGV[8]) == 1 then return 'err:code' end
local by = ''
if ARGV[9] ~= '' then
  local inviter = redis.call('GET', 'yoha:wl:ref:' .. ARGV[9])
  if inviter and inviter ~= ARGV[1] then by = inviter end
end
local pos = redis.call('INCR', 'yoha:wl:seq')
redis.call('HSET', hk, 'position', pos, 'handle', ARGV[2], 'wallet', ARGV[4], 'wallet_lc', ARGV[3],
  'tasks', ARGV[5], 'reply', ARGV[7], 'ref', ARGV[8], 'by', by, 'invites', 0, 'at', ARGV[10])
redis.call('SET', 'yoha:wl:w:' .. ARGV[3], ARGV[1])
redis.call('SET', 'yoha:wl:reply:' .. ARGV[6], ARGV[1])
redis.call('SET', 'yoha:wl:ref:' .. ARGV[8], ARGV[1])
redis.call('RPUSH', 'yoha:wl:list', ARGV[1])
if by ~= '' then redis.call('HINCRBY', 'yoha:wl:h:' .. by, 'invites', 1) end
return 'ok'
`;

const ERRORS: Record<string, [string, number]> = {
  "err:handle": ["That X account is already on the list with a different wallet.", 409],
  "err:wallet": ["That wallet is already on the list with a different X account.", 409],
  "err:reply": ["That reply link has already been used.", 409],
};

function refCode() {
  const a = new Uint8Array(6);
  crypto.getRandomValues(a);
  return [...a].map((b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("");
}

async function readEntry(handleLc: string): Promise<Entry | null> {
  const h = toObject(await redis<string[]>("HGETALL", `yoha:wl:h:${handleLc}`));
  if (!h.position) return null;
  const position = Number(h.position);
  const invites = Number(h.invites || 0);
  return { position, handle: h.handle, ref: h.ref, invites, points: points(invites), inside: position <= WAITLIST.spots };
}

async function total() {
  return Number((await redis<string | null>("GET", "yoha:wl:seq")) ?? 0);
}

export async function GET(req: NextRequest) {
  if (!redisReady) return json({ error: "The waitlist isn't connected yet." }, 503);
  try {
    const handle = (req.nextUrl.searchParams.get("handle") || "").replace(/^@/, "").trim();
    const count = await total();
    if (handle && HANDLE_RE.test(handle)) {
      const entry = await readEntry(handle.toLowerCase());
      return json({ total: count, spots: WAITLIST.spots, entry });
    }
    return json({ total: count, spots: WAITLIST.spots, closed: WAITLIST.closed });
  } catch (err) {
    console.error(err);
    return json({ error: "The list is busy. Try again in a moment." }, 500);
  }
}

export async function POST(req: NextRequest) {
  if (!redisReady) return json({ error: "The waitlist isn't connected yet." }, 503);
  if (WAITLIST.closed) return json({ error: "The waitlist is closed." }, 403);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Send the form again." }, 400);
  }

  const handle = String(body.handle ?? "").trim().replace(/^@/, "");
  const wallet = String(body.wallet ?? "").trim();
  const replyUrl = String(body.reply ?? "").trim();
  const tasks = Array.isArray(body.tasks) ? TASK_IDS.filter((t) => (body.tasks as unknown[]).includes(t)) : [];
  const ref = typeof body.ref === "string" ? body.ref.trim().toLowerCase().slice(0, 12) : "";

  if (!HANDLE_RE.test(handle)) return json({ error: "That X username doesn't look right." }, 400);
  if (!WALLET_RE.test(wallet)) return json({ error: "That wallet address doesn't look right." }, 400);
  if (tasks.length < TASK_IDS.length) return json({ error: "Finish every task first." }, 400);
  const replyId = parseReplyUrl(replyUrl, handle);
  if (!replyId) return json({ error: `Paste the link to your reply. It must be posted from @${handle}.` }, 400);

  try {
    // Light rate limit per IP: 8 joins an hour.
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    const hits = await redis<number>("INCR", `yoha:wl:ip:${ip}`);
    if (hits === 1) await redis("EXPIRE", `yoha:wl:ip:${ip}`, 3600);
    if (hits > 8) return json({ error: "Too many tries from this network. Try again later." }, 429);

    const handleLc = handle.toLowerCase();
    let result = "err:code";
    for (let i = 0; i < 3 && result === "err:code"; i++) {
      result = await redis<string>(
        "EVAL", JOIN, 0,
        handleLc, handle, wallet.toLowerCase(), wallet, tasks.join(","), replyId, replyUrl, refCode(), ref, new Date().toISOString(),
      );
    }
    if (ERRORS[result]) return json({ error: ERRORS[result][0] }, ERRORS[result][1]);
    if (result !== "ok" && result !== "existing") return json({ error: "The list is busy. Try again in a moment." }, 500);

    const entry = await readEntry(handleLc);
    return json({ total: await total(), spots: WAITLIST.spots, entry, existing: result === "existing" });
  } catch (err) {
    console.error(err);
    return json({ error: "The list is busy. Try again in a moment." }, 500);
  }
}

import { NextResponse, type NextRequest } from "next/server";

import { redis, redisPipeline, redisReady, toObject } from "@/lib/redis";
import { WAITLIST, points } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

// Download the whole list as CSV:  /api/waitlist/export?key=<WAITLIST_ADMIN_KEY>
export async function GET(req: NextRequest) {
  const key = process.env.WAITLIST_ADMIN_KEY;
  const given = req.nextUrl.searchParams.get("key") || req.headers.get("x-admin-key");
  if (!key || key.length < 16 || given !== key) return new NextResponse("Not found", { status: 404 });
  if (!redisReady) return new NextResponse("Redis is not configured", { status: 503 });

  const handles = await redis<string[]>("LRANGE", "wl:list", 0, -1);
  const rows: string[][] = [];
  for (let i = 0; i < handles.length; i += 200) {
    const batch = await redisPipeline(handles.slice(i, i + 200).map((h) => ["HGETALL", `wl:h:${h}`]));
    for (const flat of batch) {
      const e = toObject(flat as string[]);
      const invites = Number(e.invites || 0);
      rows.push([
        e.position, e.handle, e.wallet, String(points(invites)), String(invites),
        Number(e.position) <= WAITLIST.spots ? "in" : "reserve", e.reply, e.by, e.at,
      ]);
    }
  }
  const esc = (v: string | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    ["position", "x_handle", "wallet", "points", "invites", "status", "reply_link", "invited_by", "joined_at"].join(","),
    ...rows.map((r) => r.map(esc).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="yohaku-waitlist.csv"`,
      "cache-control": "no-store",
    },
  });
}

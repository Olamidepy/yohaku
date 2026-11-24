"use client";

import * as React from "react";
import { ArrowUpRight, Check, Copy, Loader2 } from "lucide-react";

import { LogoMark } from "@/components/site/logo";
import { XIcon } from "@/components/site/x-icon";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  HANDLE_RE, PINNED_POST_ID, TASKS, TASK_POINTS, WAITLIST, WALLET_RE, parseReplyUrl,
  type Entry, type TaskId,
} from "@/lib/waitlist";

const SAVE_KEY = "yohaku_waitlist";
const save = (v: object | null) => { try { if (v) localStorage.setItem(SAVE_KEY, JSON.stringify(v)); else localStorage.removeItem(SAVE_KEY); } catch {} };
const load = (): { handle?: string } => { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); } catch { return {}; } };

type Stats = { total: number; spots: number; closed?: boolean };

export function Waitlist() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [offline, setOffline] = React.useState(false);
  const [handle, setHandle] = React.useState("");
  const [avatarOk, setAvatarOk] = React.useState(false);
  const [done, setDone] = React.useState<Set<TaskId>>(new Set());
  const [reply, setReply] = React.useState("");
  const [wallet, setWallet] = React.useState("");
  const [ref, setRef] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [entry, setEntry] = React.useState<Entry | null>(null);

  const h = handle.trim().replace(/^@/, "");
  const handleOk = HANDLE_RE.test(h);
  const walletOk = WALLET_RE.test(wallet.trim());
  const replyOk = handleOk && Boolean(parseReplyUrl(reply, h));
  const tasksOk = TASKS.every((t) => done.has(t.id)) && replyOk;
  const ready = handleOk && tasksOk && walletOk && !busy;
  const spots = stats?.spots ?? WAITLIST.spots;
  const taken = Math.min(stats?.total ?? 0, spots);
  const full = (stats?.total ?? 0) >= spots;
  const earned = TASKS.filter((t) => done.has(t.id) && (t.id !== "reply" || replyOk)).reduce((n, t) => n + t.points, 0);

  // Stats, the invite code in the URL, and a saved entry from an earlier visit.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) setRef(r.slice(0, 12));
    const saved = load().handle;
    fetch(`/api/waitlist${saved ? `?handle=${encodeURIComponent(saved)}` : ""}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const body = await res.json();
        setStats({ total: body.total, spots: body.spots, closed: body.closed });
        if (body.entry) setEntry(body.entry);
        else if (saved) save(null);
      })
      .catch(() => setOffline(true));
  }, []);

  async function claim() {
    if (!ready) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ handle: h, wallet: wallet.trim(), reply: reply.trim(), tasks: [...done], ref }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong. Try again.");
      setEntry(body.entry);
      setStats((s) => ({ ...(s ?? { spots }), total: body.total, spots: body.spots }));
      save({ handle: h });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const open = (id: TaskId, href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
    setDone((s) => new Set(s).add(id));
  };

  return (
    <section className="mx-auto grid max-w-6xl items-start gap-6 px-4 pb-28 sm:px-6 lg:grid-cols-[1fr_400px]">
      {/* Pass + spot grid */}
      <aside className="lg:sticky lg:top-28 lg:order-2">
        <Pass entry={entry} handle={entry?.handle ?? (handleOk ? h : "")} avatar={entry ? true : avatarOk} points={entry?.points ?? earned} taken={taken} spots={spots} />
        {entry ? <Invite entry={entry} /> : null}
      </aside>

      <div className="lg:order-1">
        {offline ? (
          <p className="mb-6 border border-black bg-hl px-4 py-3 text-sm">The waitlist isn&apos;t connected yet. Check back in a few minutes.</p>
        ) : null}

        {entry ? (
          <div className="border border-black p-6 sm:p-8">
            <p className="label text-muted-foreground">{entry.inside ? "You're in" : "You're on the reserve list"}</p>
            <h2 className="mt-3 font-pixel text-4xl leading-none font-bold uppercase sm:text-5xl">
              {entry.inside ? `Spot #${entry.position} of ${spots}` : `Reserve #${entry.position - spots}`}
            </h2>
            <p className="mt-4 max-w-[54ch] text-muted-foreground">
              {entry.inside
                ? "Your spot is saved. Keep your follow, like, repost and reply up: every entry is checked on X before the airdrop, and entries that undo a task lose their spot."
                : `All ${spots} spots are taken. If anyone in the ${spots} is removed for skipping a task, reserve spots move up by points.`}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Invite friends with your link to earn {WAITLIST.invitePoints} points each.</p>
            <button type="button" className="label mt-6 underline underline-offset-4" onClick={() => { save(null); setEntry(null); }}>
              Not you? Enter another account
            </button>
          </div>
        ) : (
          <>
            <ol className="grid border border-black">
              {/* 1 */}
              <Step n="01" title="Your X username" state={handleOk}>
                <label htmlFor="wl-handle" className="label text-muted-foreground">Username</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-12 flex-1 items-center border border-black px-3 focus-within:ring-2 focus-within:ring-black">
                    <span className="text-muted-foreground">@</span>
                    <input
                      id="wl-handle" value={handle} onChange={(e) => { setHandle(e.target.value); setAvatarOk(false); }} maxLength={16}
                      autoComplete="off" spellCheck={false} placeholder="yourhandle"
                      className="h-full w-full bg-transparent pl-1 outline-none"
                    />
                  </div>
                  {handleOk ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={h} src={`https://unavatar.io/x/${encodeURIComponent(h)}?fallback=false`} alt=""
                      onLoad={() => setAvatarOk(true)} onError={() => setAvatarOk(false)}
                      className={cn("size-12 shrink-0 rounded-full border border-black object-cover", !avatarOk && "hidden")}
                    />
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Letters, numbers and underscores. Your X picture shows up when we find you.</p>
              </Step>

              {/* 2 */}
              <Step n="02" title="Show up on X" state={tasksOk} extra={<span className="font-mono text-sm">{earned}/{TASK_POINTS} pts</span>}>
                <ul className="grid gap-2">
                  {TASKS.map((t) => {
                    const ok = done.has(t.id) && (t.id !== "reply" || replyOk);
                    return (
                      <li key={t.id}>
                        <button
                          type="button" onClick={() => open(t.id, t.href)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 border px-4 py-3 text-left transition-colors",
                            ok ? "border-black bg-black text-white" : "border-black hover:bg-hl",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span className={cn("grid size-5 place-items-center border", ok ? "border-white" : "border-black")}>
                              {ok ? <Check className="size-3.5" /> : null}
                            </span>
                            {t.label}
                          </span>
                          <span className="flex items-center gap-2 font-mono text-xs">
                            +{t.points}
                            <ArrowUpRight className="size-4" />
                          </span>
                        </button>
                        {t.id === "reply" && done.has("reply") ? (
                          <div className="mt-2 border border-dashed border-black p-3">
                            <label htmlFor="wl-reply" className="label text-muted-foreground">Paste the link to your reply</label>
                            <input
                              id="wl-reply" value={reply} onChange={(e) => setReply(e.target.value)} autoComplete="off" spellCheck={false}
                              placeholder={`https://x.com/${h || "you"}/status/…`}
                              className="mt-2 h-11 w-full border border-black bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                            />
                            <p className={cn("mt-2 text-sm", reply && !replyOk ? "text-red" : "text-muted-foreground")}>
                              {reply && !replyOk
                                ? !handleOk
                                  ? "Type your X username in step 1 first. The reply must come from that account."
                                  : `That link must be a reply posted from @${h}. Check the username in step 1.`
                                : "On X, tap Share on your reply, then Copy link."}
                            </p>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                {!PINNED_POST_ID ? <p className="mt-2 text-sm text-muted-foreground">The pinned post is on {SITE.xHandle}&apos;s profile.</p> : null}
                <p className="mt-3 text-sm text-muted-foreground">Every task is checked on X before the airdrop. Entries that skip one lose their spot.</p>
              </Step>

              {/* 3 */}
              <Step n="03" title="Ethereum wallet" state={walletOk} last>
                <label htmlFor="wl-wallet" className="label text-muted-foreground">Public address</label>
                <input
                  id="wl-wallet" value={wallet} onChange={(e) => setWallet(e.target.value)} autoComplete="off" spellCheck={false} placeholder="0x…"
                  className="mt-2 h-12 w-full border border-black bg-white px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-black"
                />
                <p className={cn("mt-2 text-sm", wallet && !walletOk ? "text-red" : "text-muted-foreground")}>
                  {wallet && !walletOk ? "That address doesn't look right. It starts with 0x and has 42 characters." : "Paste a wallet you control. No signature, no seed phrase, ever."}
                </p>
              </Step>
            </ol>

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="h-12 rounded-full px-8" disabled={!ready || offline || stats?.closed} onClick={claim}>
                {busy ? <Loader2 className="animate-spin" /> : null}
                {stats?.closed ? "Waitlist closed" : full ? "Join the reserve list" : "Claim my spot"}
              </Button>
              <p role="status" className={cn("text-sm", error ? "text-red" : "text-muted-foreground")}>
                {error || (ready ? "Ready." : "Finish all three steps to unlock.")}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Step({ n, title, state, extra, last, children }: { n: string; title: string; state: boolean; extra?: React.ReactNode; last?: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("p-5 sm:p-7", !last && "border-b border-black")}>
      <div className="mb-4 flex items-center gap-4">
        <span className="font-pixel text-2xl font-bold">{n}</span>
        <h3 className="flex-1 text-lg font-semibold">{title}</h3>
        {extra}
        <span className={cn("grid size-6 place-items-center border border-black", state && "bg-black text-white")}>{state ? <Check className="size-4" /> : null}</span>
      </div>
      {children}
    </li>
  );
}

function Pass({ entry, handle, avatar, points, taken, spots }: { entry: Entry | null; handle: string; avatar: boolean; points: number; taken: number; spots: number }) {
  const cols = 20;
  return (
    <div className="bg-black p-5 text-white sm:p-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2"><LogoMark className="size-6" /><span className="font-pixel font-bold tracking-wider">YOHAKU</span></span>
        <span className="label border border-white/40 px-2 py-1 text-white/80">{entry ? (entry.inside ? "In" : "Reserve") : "Preview"}</span>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="label text-white/50">Spot</p>
          <p className="font-pixel text-7xl leading-none font-bold">{entry ? `#${entry.position}` : "#—"}</p>
        </div>
        <p className="font-jp text-5xl leading-none">余白</p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-white/20 pt-4">
        {handle && avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`https://unavatar.io/x/${encodeURIComponent(handle)}?fallback=false`} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} className="size-10 rounded-full border border-white/40 object-cover" />
        ) : (
          <span className="size-10 rounded-full border border-dashed border-white/40" />
        )}
        <span className="flex-1 truncate font-mono text-sm">{handle ? `@${handle}` : "@yourhandle"}</span>
        <span className="text-right">
          <span className="label block text-white/50">Points</span>
          <span className="font-pixel text-2xl font-bold">{points}</span>
        </span>
      </div>

      {/* One dot per spot */}
      <div className="mt-6 border-t border-white/20 pt-4">
        <div className="flex items-baseline justify-between">
          <p className="label text-white/50">Spots taken</p>
          <p className="font-mono text-sm"><b className="text-lg">{taken}</b> / {spots}</p>
        </div>
        <div className="mt-3 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden="true">
          {Array.from({ length: spots }, (_, i) => {
            const mine = entry?.inside && i === entry.position - 1;
            return (
              <span
                key={i}
                className={cn("aspect-square rounded-full", mine ? "bg-red" : i < taken ? "bg-white" : "bg-white/15")}
              />
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/50">{Math.max(spots - taken, 0)} left. The first {spots} share the airdrop.</p>
      </div>
    </div>
  );
}

function Invite({ entry }: { entry: Entry }) {
  const [copied, setCopied] = React.useState(false);
  const link = `${SITE.url.replace(/\/$/, "")}/waitlist?ref=${entry.ref}`;
  const text = entry.inside
    ? `I'm spot #${entry.position} on the Yohaku 余白 waitlist. Only ${WAITLIST.spots} spots.`
    : `I'm on the Yohaku 余白 waitlist.`;
  return (
    <div className="mt-3 border border-black p-5">
      <div className="flex items-center justify-between">
        <p className="label">Your invite link</p>
        <p className="font-mono text-xs text-muted-foreground">{entry.invites} invited · +{WAITLIST.invitePoints} each</p>
      </div>
      <div className="mt-3 flex">
        <input readOnly value={link} className="h-10 min-w-0 flex-1 border border-black bg-white px-3 font-mono text-xs" onFocus={(e) => e.target.select()} />
        <button
          type="button" aria-label="Copy invite link"
          className="grid w-10 place-items-center border border-l-0 border-black bg-black text-white"
          onClick={() => { navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {}); }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      <Button asChild className="mt-3 w-full rounded-full">
        <a href={`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer">
          <XIcon /> Share on X
        </a>
      </Button>
    </div>
  );
}

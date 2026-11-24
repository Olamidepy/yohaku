import { SITE } from "@/lib/data";

// Waitlist settings. Edit here, not in components.

const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

/** The pinned post people like, repost and reply to. */
export const PINNED_POST_URL = env(process.env.NEXT_PUBLIC_PINNED_POST_URL) ?? "";
export const PINNED_POST_ID = PINNED_POST_URL.match(/status\/(\d+)/)?.[1] ?? "";

export const X_HANDLE = SITE.xHandle.replace(/^@/, "");

export const WAITLIST = {
  spots: Number(process.env.NEXT_PUBLIC_WAITLIST_SPOTS || 200),
  /** Set to "1" to stop new entries (the page then shows the list as closed). */
  closed: env(process.env.NEXT_PUBLIC_WAITLIST_CLOSED) === "1",
  invitePoints: 20,
} as const;

export type TaskId = "follow" | "like" | "repost" | "reply";

const tweet = PINNED_POST_ID;
const replyText = "Leaving space for 余白 @" + X_HANDLE;

export const TASKS: { id: TaskId; label: string; points: number; href: string }[] = [
  { id: "follow", label: `Follow @${X_HANDLE}`, points: 10, href: `https://x.com/intent/follow?screen_name=${X_HANDLE}` },
  { id: "like", label: "Like the pinned post", points: 10, href: tweet ? `https://x.com/intent/like?tweet_id=${tweet}` : SITE.x },
  { id: "repost", label: "Repost the pinned post", points: 20, href: tweet ? `https://x.com/intent/retweet?tweet_id=${tweet}` : SITE.x },
  {
    id: "reply",
    label: "Reply to the pinned post",
    points: 30,
    href: tweet ? `https://x.com/intent/post?in_reply_to=${tweet}&text=${encodeURIComponent(replyText)}` : SITE.x,
  },
];

export const TASK_IDS = TASKS.map((t) => t.id);
export const TASK_POINTS = TASKS.reduce((n, t) => n + t.points, 0);

export const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;
export const WALLET_RE = /^0x[0-9a-fA-F]{40}$/;

/** A reply link must be a post by the same X account: x.com/<handle>/status/<id>. */
export function parseReplyUrl(url: string, handle: string): string | null {
  const m = url.trim().match(/^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})/i);
  if (!m || m[1].toLowerCase() !== handle.toLowerCase()) return null;
  if (m[2] === PINNED_POST_ID) return null;
  return m[2];
}

export const points = (invites: number) => TASK_POINTS + invites * WAITLIST.invitePoints;

export type Entry = {
  position: number;
  handle: string;
  ref: string;
  invites: number;
  points: number;
  inside: boolean;
};

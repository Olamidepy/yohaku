import { cn } from "@/lib/utils";

/** The Yohaku mark: an empty frame with one red dot. The space left on purpose. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="22.5" cy="9.5" r="3" fill="#e0201b" />
    </svg>
  );
}

/** Mark + dot-matrix name. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <LogoMark className="size-[1.15em]" />
      <span className="font-pixel font-bold tracking-[0.04em] leading-none">YOHAKU</span>
    </span>
  );
}

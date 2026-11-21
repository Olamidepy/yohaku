import { cn } from "@/lib/utils";

/** The Yohaku mark (the dotted sphere). Takes the current text colour, so it works on white and on black. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={{ maskImage: "url(/mark.png)", WebkitMaskImage: "url(/mark.png)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
    />
  );
}

/** Mark + pixel name. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <LogoMark className="size-[1.35em]" />
      <span className="font-pixel font-bold tracking-[0.04em] leading-none">YOHAKU</span>
    </span>
  );
}

/** Left-aligned page opener used by inner pages. */
export function PageHeader({ eyebrow, title, body, children }: { eyebrow?: string; title: string; body?: string; children?: React.ReactNode }) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-40 pb-12 sm:px-6 sm:pt-48">
      {eyebrow ? <p className="label mb-5 flex items-center gap-2 text-muted-foreground"><span className="size-1.5 rounded-full bg-red" />{eyebrow}</p> : null}
      <h1 className="font-pixel text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-bold uppercase">{title}</h1>
      {body ? <p className="mt-5 max-w-[58ch] text-lg text-muted-foreground">{body}</p> : null}
      {children}
    </header>
  );
}

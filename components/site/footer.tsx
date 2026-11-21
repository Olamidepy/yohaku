import Link from "next/link";

import { Wordmark } from "@/components/site/logo";
import { XIcon } from "@/components/site/x-icon";
import { NAV, SITE } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex" aria-label="Yohaku home">
            <Wordmark className="text-xl" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            {SITE.kanji} · {SITE.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="label text-muted-foreground hover:text-foreground">
              {n.label}
            </Link>
          ))}
          <a href={SITE.launchpadUrl} target="_blank" rel="noopener noreferrer" className="label text-muted-foreground hover:text-foreground">
            {SITE.launchpad}
          </a>
          {SITE.x ? (
            <a href={SITE.x} target="_blank" rel="noopener noreferrer" aria-label="Yohaku on X" className="text-muted-foreground hover:text-foreground">
              <XIcon className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          Tokens can lose all value. Trades are final. Nothing here is financial advice. Yohaku will never DM you an address or ask for your seed phrase.
        </p>
      </div>
    </footer>
  );
}

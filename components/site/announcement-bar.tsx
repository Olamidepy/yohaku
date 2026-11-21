"use client";

import * as React from "react";
import { X } from "lucide-react";

import { CopyAddress } from "@/components/site/copy-address";
import { SITE, TOKEN } from "@/lib/data";

/** Thin bar above the nav. Before launch it only says where the contract will be posted. */
export function AnnouncementBar() {
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  const live = Boolean(TOKEN.address);
  const where = SITE.xHandle ?? "our official X account";

  return (
    <div className="pointer-events-auto relative border-b bg-black text-[13px] text-white">
      <div className="mx-auto flex min-h-9 max-w-6xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 py-2 pr-10 pl-4 text-center">
        <span className="size-1.5 shrink-0 rounded-full bg-red" aria-hidden="true" />
        {live ? (
          <>
            <p className="label !text-[11px]">{TOKEN.symbol} is live on {SITE.launchpad}. Official contract</p>
            <CopyAddress address={TOKEN.address!} full={false} className="text-white" />
          </>
        ) : (
          <p className="label !text-[11px]">
            <span className="hidden sm:inline">Launching soon on {SITE.launchpad} · </span>The contract will only be posted by{" "}
            {SITE.x ? (
              <a href={SITE.x} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {where}
              </a>
            ) : (
              where
            )}
          </p>
        )}
        <button type="button" onClick={() => setOpen(false)} className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-md text-white/60 hover:text-white" aria-label="Dismiss announcement">
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

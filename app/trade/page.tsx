import type { Metadata } from "next";
import { CircleAlert } from "lucide-react";

import { PageHeader } from "@/components/site/page-header";
import { Swap } from "@/components/site/swap";
import { TokenCard } from "@/components/site/token-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SITE, TOKEN } from "@/lib/data";

export const metadata: Metadata = { title: "Trade" };

export default function TradePage() {
  return (
    <>
      <PageHeader eyebrow="Trade" title="Take a little space." body={`Buy or sell ${TOKEN.symbol} in the official pool on ${SITE.chain}.`} />
      <section className="mx-auto grid max-w-6xl items-start gap-6 px-4 pb-28 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="lg:order-2">
          <Swap />
        </div>
        <div className="grid gap-6 lg:order-1">
          <Alert>
            <CircleAlert />
            <AlertTitle>Only trade through the official pool</AlertTitle>
            <AlertDescription>
              The official address is on this page and posted by {SITE.xHandle ?? "our official X account"}. At launch the buy fee starts at {TOKEN.openingFeePct}% and falls to normal over {TOKEN.openingFeeSeconds} seconds, and for the first {TOKEN.protectionSeconds / 60} minutes no wallet can hold more than {TOKEN.walletCapPct}% of supply. Wait out the first 30 seconds. Trades are final and tokens can lose all value.
            </AlertDescription>
          </Alert>
          <TokenCard />
        </div>
      </section>
    </>
  );
}

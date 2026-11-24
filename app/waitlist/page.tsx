import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { Waitlist } from "@/components/site/waitlist";
import { WAITLIST } from "@/lib/waitlist";

export const metadata: Metadata = {
  title: "Waitlist",
  description: `Join the Yohaku 余白 waitlist. The first ${WAITLIST.spots} share the airdrop.`,
};

export default function WaitlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Waitlist"
        title={`${WAITLIST.spots} spots. Leave room.`}
        body={`Three steps, about a minute. The first ${WAITLIST.spots} on the list share the Yohaku airdrop. We only use your public X username and your wallet's public address. Never a signature, never a seed phrase.`}
      />
      <Waitlist />
    </>
  );
}

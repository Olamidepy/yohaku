import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { PixelBlob, PixelMosaic } from "@/components/site/pixel-blob";
import { Reveal } from "@/components/site/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FACTS, FAQ, PRINCIPLES, SITE, STEPS, TOKEN, TOTAL_FEE } from "@/lib/data";

const Band = () => <div className="band" aria-hidden="true" />;

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative isolate overflow-hidden bg-white">
        <PixelBlob
          cols={22}
          rows={16}
          seed={11}
          density={0.62}
          centers={[[0.72, 0.42, 0.42], [0.95, 0.85, 0.3], [0.5, 0.95, 0.18]]}
          className="absolute top-0 right-0 -z-10 h-[40%] w-[46%] sm:h-[78%] sm:w-[60%]"
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-4 pt-32 pb-8 sm:px-6">
          <h1 className="fade-up font-pixel text-[clamp(4.5rem,15vw,13rem)] leading-[0.86] font-bold tracking-[-0.02em] uppercase mix-blend-difference text-white">
            <span className="block">Yohaku</span>
            <span className="block font-jp font-normal tracking-normal">余白</span>
            <span className="block">Space</span>
          </h1>

          <div className="mt-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div className="fade-up max-w-sm bg-white p-1 [--d:200ms]">
              <p className="font-jp text-lg">「余白」は、空っぽではない。</p>
              <p className="mt-2 text-lg leading-snug font-medium">
                The space left on purpose. A quiet token on {SITE.chain}, with nothing extra.
              </p>
            </div>
            <div className="fade-up flex flex-wrap gap-2 [--d:320ms]">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/trade">
                  Trade {TOKEN.symbol}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-black bg-white px-6">
                <Link href="/#idea">The idea</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Band />

      {/* ─── Statement in highlight boxes ─── */}
      <section id="idea" className="scroll-mt-24 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <p className="font-jp text-[clamp(2.2rem,7vw,5.6rem)] leading-[1.35]">
              <span className="hl">「何もない」</span>を、つくる。
              <br />
              <span className="hl">「余白」</span>を、残す。
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10 grid gap-2 border-t border-black pt-6 sm:grid-cols-2">
            <p className="label">We make nothing. We leave space.</p>
            <p className="max-w-[52ch] text-muted-foreground sm:justify-self-end">
              余白 (yohaku) is the Japanese idea of white space: the part of a page, a painting or a garden left empty on purpose, so everything else can be seen.
            </p>
          </Reveal>
        </div>
      </section>

      <Band />

      {/* ─── Definition + mosaic ─── */}
      <section className="grid bg-white md:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-4 py-16 sm:px-10 sm:py-24">
          <p className="label">
            <span className="bg-black px-1.5 py-0.5 text-white">Definition</span>
          </p>
          <p className="mt-8 font-jp text-6xl">
            余白 <span className="text-2xl text-muted-foreground">yohaku · noun</span>
          </p>
          <ol className="mt-10 grid gap-6 text-[clamp(1.15rem,2vw,1.45rem)] leading-snug font-medium">
            <li className="grid grid-cols-[2rem_1fr]">
              <span className="font-pixel">1.</span>
              The white space on a page, left empty on purpose so that everything else can breathe.
            </li>
            <li className="grid grid-cols-[2rem_1fr] text-muted-foreground">
              <span className="font-pixel text-black">2.</span>A token on {SITE.chain} with nothing extra: fixed supply, fixed fees, liquidity locked forever, no owner.
            </li>
          </ol>
        </Reveal>
        <div className="relative min-h-[360px] bg-black md:min-h-0">
          <PixelMosaic cols={8} rows={8} seed={5} className="absolute inset-0 h-full w-full" />
        </div>
      </section>

      <Band />

      {/* ─── Big type cut by a black panel ─── */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1.25fr_1fr]">
          <Reveal className="relative z-10 px-4 py-14 sm:px-6">
            <p className="font-pixel text-[clamp(4rem,12vw,10.5rem)] leading-[0.86] font-bold uppercase">
              Nothing
              <br />
              Extra
            </p>
          </Reveal>
          <div className="flex flex-col justify-center gap-4 bg-black px-6 py-12 text-white sm:px-10">
            <p className="font-jp text-[clamp(1.6rem,3vw,2.4rem)] leading-snug">
              足さない。
              <br />
              引いて、残す。
            </p>
            <p className="max-w-sm text-white/70">Everyone is adding features, promises and noise. Yohaku takes things away, and keeps only what has to be there.</p>
          </div>
        </div>
      </section>

      <Band />

      {/* ─── Principles ─── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-pixel text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-bold uppercase">Rules</h2>
            <p className="label">
              <span className="hl">ルール · 4</span>
            </p>
          </Reveal>
          <div className="mt-12 grid border-t border-l border-black sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 80} className="border-r border-b border-black p-6 sm:p-10">
                <p className="font-pixel text-5xl font-bold">{p.n}</p>
                <h3 className="mt-10 text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 max-w-[44ch] text-muted-foreground">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Band />

      {/* ─── Token: big numbers ─── */}
      <section id="token" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="label">
                <span className="hl">トークン · Token</span>
              </p>
              <h2 className="mt-6 font-pixel text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-bold uppercase">
                Set once.
                <br />
                Never touched.
              </h2>
            </div>
            <p className="max-w-xs text-muted-foreground">Launched through {SITE.launchpad}&apos;s protected launch on {SITE.chain}. Every number is fixed in code at launch.</p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {FACTS.map((f, i) => (
              <Reveal key={f.label} delay={i * 70}>
                <p className="label text-muted-foreground">{f.label}</p>
                <p className="mt-3 font-pixel text-[clamp(4rem,9vw,7rem)] leading-none font-bold">{f.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{f.note}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 grid border border-black md:grid-cols-2">
            <div className="p-6 sm:p-10">
              <p className="label">
                <span className="bg-black px-1.5 py-0.5 text-white">Every trade · {TOTAL_FEE}% in ETH</span>
              </p>
              <div className="mt-8 flex h-6 border border-black">
                <div className="bg-black" style={{ width: `${(TOKEN.creatorFee / TOTAL_FEE) * 100}%` }} />
                <div className="bg-[repeating-linear-gradient(90deg,#000_0_2px,#fff_2px_5px)]" style={{ width: `${(TOKEN.platformFee / TOTAL_FEE) * 100}%` }} />
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-muted-foreground">Creator fee</dt>
                  <dd className="mt-1 font-pixel text-5xl font-bold">{TOKEN.creatorFee}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{SITE.launchpad}</dt>
                  <dd className="mt-1 font-pixel text-5xl font-bold">{TOKEN.platformFee}%</dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-muted-foreground">On every buy and sell in the official pool. Fixed in the pool&apos;s hook: it can never be raised or lowered.</p>
            </div>
            <div className="border-t border-black bg-black p-6 text-white sm:p-10 md:border-t-0">
              <p className="label">
                <span className="bg-white px-1.5 py-0.5 text-black">Launch protection</span>
              </p>
              <ul className="mt-8 grid gap-6">
                <li>
                  <p className="font-pixel text-2xl font-bold">0–{TOKEN.openingFeeSeconds}s</p>
                  <p className="mt-1 text-white/70">Buy fee starts at {TOKEN.openingFeePct}% and falls steadily to {TOTAL_FEE}%. Snipers pay for speed.</p>
                </li>
                <li>
                  <p className="font-pixel text-2xl font-bold">0–{TOKEN.protectionSeconds / 60}min</p>
                  <p className="mt-1 text-white/70">No wallet can buy or receive more than {TOKEN.walletCapPct}% of supply in total.</p>
                </li>
                <li>
                  <p className="font-pixel text-2xl font-bold">After</p>
                  <p className="mt-1 text-white/70">Quiet. A normal pool, with nothing left to change.</p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <Band />

      {/* ─── Steps ─── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <h2 className="font-pixel text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-bold uppercase">
              3 steps.
              <br />
              Then nothing.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-px bg-black md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="bg-white p-6 sm:p-8">
                <p className="font-pixel text-6xl font-bold">{Number(s.n)}</p>
                <h3 className="mt-10 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Band />

      {/* ─── FAQ ─── */}
      <section id="faq" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-pixel text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-bold uppercase">FAQ</h2>
            <p className="mt-4 font-jp text-xl">
              <span className="hl">質問は、少なく。</span>
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="border-t border-black">
              {FAQ.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-black">
                  <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="max-w-[60ch] text-base text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ─── Close: vertical name, big statement, arrow ─── */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] gap-6 px-4 py-16 sm:gap-12 sm:px-6 sm:py-24">
          <p className="font-pixel text-[clamp(4.5rem,11vw,9rem)] leading-none font-bold uppercase [writing-mode:vertical-rl] rotate-180">Yohaku</p>
          <div className="flex flex-col justify-between gap-12">
            <p className="font-jp text-[clamp(1.8rem,5vw,4rem)] leading-[1.4]">
              <span className="bg-white px-2 text-black">「余白」</span>を、
              <br />
              持っておこう。
            </p>
            <p className="max-w-md text-white/70">Hold a little white space. {SITE.description}</p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                <Button asChild size="lg" className="rounded-full bg-white px-6 text-black hover:bg-white/85">
                  <Link href="/trade">
                    Trade {TOKEN.symbol}
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                  <a href={TOKEN.coinPage ?? SITE.launchpadUrl} target="_blank" rel="noopener noreferrer">
                    {SITE.launchpad}
                    <ArrowUpRight />
                  </a>
                </Button>
              </div>
              <ArrowDown className="size-20 stroke-[1.25] text-white/90" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

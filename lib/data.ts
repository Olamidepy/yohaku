import { isAddress, type Address } from "viem";

// All Yohaku copy and numbers in one place. Edit here, not in components.

const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
const addr = (v: string | undefined) => {
  const a = env(v);
  return a && isAddress(a) ? (a as Address) : undefined;
};

export const SITE = {
  name: "Yohaku",
  kanji: "余白",
  kana: "よはく",
  tagline: "The space left on purpose.",
  description:
    "Yohaku (余白) is the Japanese idea of white space: the part of a page left empty on purpose, so everything else can breathe. A quiet token on Ethereum, launched on Programmable.",
  url: env(process.env.NEXT_PUBLIC_APP_URL) ?? "https://www.yohamarket.xyz",
  x: env(process.env.NEXT_PUBLIC_X_URL) ?? "https://x.com/yoha_market",
  xHandle: env(process.env.NEXT_PUBLIC_X_HANDLE) ?? "@yoha_market",
  chain: "Ethereum",
  launchpad: "Programmable",
  launchpadUrl: "https://programmable.market",
} as const;

/**
 * The token comes from the Programmable launch. Addresses stay empty until the launch is final,
 * so the site never shows an address that could be copied by scammers before then.
 */
const tokenAddress = addr(process.env.NEXT_PUBLIC_YOHAKU_TOKEN_ADDRESS);
const ticker = env(process.env.NEXT_PUBLIC_TOKEN_TICKER);

export const TOKEN = {
  address: tokenAddress,
  hook: addr(process.env.NEXT_PUBLIC_YOHAKU_HOOK_ADDRESS),
  symbol: ticker ? `$${ticker.replace(/^\$/, "")}` : "Yohaku",
  unit: ticker ? ticker.replace(/^\$/, "") : "tokens",
  supply: Number(process.env.NEXT_PUBLIC_TOKEN_SUPPLY || 1_000_000_000),
  decimals: 18,
  poolFee: Number(process.env.NEXT_PUBLIC_POOL_FEE || 0),
  tickSpacing: Number(process.env.NEXT_PUBLIC_POOL_TICK_SPACING || 60),
  /* Programmable launch protection (fixed by Programmable). */
  protectionSeconds: 300,
  walletCapPct: 2,
  openingFeePct: 99,
  openingFeeSeconds: 30,
  minFdvUsd: 15_000,
  /** Creator fee on every buy and sell in the official pool, in percent. */
  creatorFee: Number(process.env.NEXT_PUBLIC_CREATOR_FEE || 4.7),
  /** Programmable's platform fee, in percent. */
  platformFee: 0.3,
  coinPage: env(process.env.NEXT_PUBLIC_PROGRAMMABLE_COIN_URL),
  etherscan: tokenAddress ? `https://etherscan.io/token/${tokenAddress}` : undefined,
  dexscreener: tokenAddress ? `https://dexscreener.com/ethereum/${tokenAddress}` : undefined,
  uniswap: tokenAddress ? `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE&outputCurrency=${tokenAddress}` : undefined,
};

export const TOTAL_FEE = Math.round((TOKEN.creatorFee + TOKEN.platformFee) * 100) / 100;

export const NAV = [
  { href: "/#idea", label: "Idea" },
  { href: "/#token", label: "Token" },
  { href: "/#faq", label: "FAQ" },
  { href: "/trade", label: "Trade" },
  { href: "/waitlist", label: "Waitlist" },
] as const;

/** The manifesto. Short lines, lots of air. */
export const PRINCIPLES = [
  { n: "01", title: "Less, on purpose.", body: "No roadmap of forty promises. No dashboard of flashing numbers. One token, one idea, nothing extra." },
  { n: "02", title: "Space is a feature.", body: "In a Japanese ink painting the empty paper is part of the picture. In a noisy market, quiet is the rarest thing you can hold." },
  { n: "03", title: "Fixed forever.", body: "Supply and liquidity are set at launch and locked in code. There is no owner, no admin key and nothing to change later." },
  { n: "04", title: "Nothing hidden.", body: "No team allocation and no presale. The whole supply goes into the pool on day one, and every number on this page can be checked onchain." },
] as const;

export const STEPS = [
  { n: "01", title: "Get ETH on Ethereum", body: "Any wallet works: Rabby, MetaMask, Zerion or Coinbase Wallet. Make sure it's Ethereum Mainnet, not another network." },
  { n: "02", title: "Check the contract", body: "Copy the official address from this site or our X account only. Anything else is not Yohaku." },
  { n: "03", title: "Trade, then leave it", body: "Buy on the Trade page or on Uniswap. Then do the hardest thing in crypto: nothing." },
] as const;

export const FAQ = [
  { q: "What does Yohaku mean?", a: "余白 (yohaku) is Japanese for the blank margin: the white space on a page, in a painting or a garden that is left empty on purpose. It isn't missing anything. It is what lets everything else be seen." },
  { q: "What is the Yohaku token?", a: "A fixed-supply token on Ethereum, launched through Programmable. One billion tokens, all of them in the pool from the first block. It is a brand and a statement more than a product: quiet, minimal and permanent." },
  { q: "Is the liquidity locked?", a: "Yes, forever. The launch contract holds the pool position and has no function to remove or move it. Nobody can pull the liquidity, including us." },
  { q: "How does launch protection work?", a: `For the first ${TOKEN.openingFeeSeconds} seconds the buy fee starts at ${TOKEN.openingFeePct}% and falls steadily to the normal rate. For the first ${TOKEN.protectionSeconds / 60} minutes no wallet can buy or receive more than ${TOKEN.walletCapPct}% of the supply. It stops bots and snipers from taking the launch.` },
  { q: "Where is the official contract?", a: "On this site and on our official X account, posted at launch. Never trust an address sent to you in a DM or posted anywhere else." },
] as const;

export const FACTS = [
  { value: "1B", label: "Total supply", note: "Fixed. No mint function." },
  { value: "1", label: "Pool", note: "One official pool on Ethereum." },
  { value: "0", label: "Team allocation", note: "All supply in the pool at launch." },
  { value: "∞", label: "Liquidity lock", note: "No owner. No way to remove it." },
] as const;

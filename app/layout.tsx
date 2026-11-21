import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/geist-mono";
import "@fontsource/doto/700.css";
import "@fontsource/doto/900.css";
import "@fontsource-variable/pixelify-sans";
import "@fontsource/dotgothic16";

import { Web3Provider } from "@/components/providers/web3";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Yohaku 余白: the space left on purpose", template: "%s · Yohaku" },
  description: SITE.description,
  openGraph: { images: ["/avatar.png"] },
  twitter: { card: "summary", site: SITE.xHandle, images: ["/avatar.png"] },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col overflow-x-hidden">
        <Web3Provider>
          <TooltipProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

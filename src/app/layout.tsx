import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Font budget (SEO/performance audit, Oct 2026): fonts were 339 KB in 8 preloaded files and held back LCP on 4G.
// Display face: two static weights instead of the 153 KB variable file. 500 renders as 600, 700 as 800.
// Not preloaded: the body font and the LCP image get the bandwidth first; headings swap in shortly after.
const anek = Anek_Bangla({ subsets: ["bengali", "latin"], weight: ["600", "800"], variable: "--font-anek", display: "swap", preload: false });
// Body face: regular and semibold. Medium (500) renders as 400, bold (700) as 600.
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600"], variable: "--font-hind", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Poultry BAZAR — মুরগী কেনাবেচার অনলাইন বাজার | আজকের দর",
    template: "%s | Poultry BAZAR",
  },
  description:
    "খামার থেকে সরাসরি ব্রয়লার, সোনালী, লেয়ার, দেশি মুরগী ও হাঁস কিনুন-বেচুন। জেলাভিত্তিক বিজ্ঞাপন, আজকের বাজার দর ও পাইকারের চাহিদা এক জায়গায়।",
  applicationName: "Poultry BAZAR",
  openGraph: { siteName: "Poultry BAZAR", locale: "bn_BD", type: "website" },
  twitter: { card: "summary_large_image" },
  // No canonical here: it would be inherited by every page that forgets its own (pageMeta sets it).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#141C47",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${anek.variable} ${hind.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          মূল অংশে যান
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

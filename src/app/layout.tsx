import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_URL } from "@/lib/site";

const anek = Anek_Bangla({ subsets: ["bengali", "latin"], weight: ["500", "600", "700", "800"], variable: "--font-anek", display: "swap" });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap" });

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
  alternates: { canonical: "/" },
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

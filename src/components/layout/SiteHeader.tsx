import Link from "next/link";
import { Plus, Smartphone } from "lucide-react";
import { Logo } from "../brand/Logo";
import { AccountLink } from "./AccountLink";
import { MobileNav } from "./MobileNav";

export const NAV = [
  { href: "/ads", label: "সব বিজ্ঞাপন" },
  { href: "/rates", label: "আজকের দর" },
  { href: "/wanted", label: "কিনতে চাই" },
  { href: "/safety", label: "নিরাপদ কেনাবেচা" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 md:px-6">
        <Link href="/" aria-label="Poultry BAZAR হোম" className="shrink-0">
          <span className="hidden sm:block">
            <Logo />
          </span>
          <span className="sm:hidden">
            <Logo compact />
          </span>
        </Link>

        <nav aria-label="প্রধান" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-ink/80 hover:bg-paper hover:text-field-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/app" className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-field-800 hover:bg-paper xl:inline-flex">
            <Smartphone className="size-[18px]" aria-hidden /> অ্যাপ
          </Link>
          <AccountLink />
          <Link
            href="/sell"
            className="hidden items-center gap-1.5 rounded-full bg-comb-600 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-comb-700 md:inline-flex"
          >
            <Plus className="size-4" strokeWidth={2.5} aria-hidden />
            বিক্রি করুন
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

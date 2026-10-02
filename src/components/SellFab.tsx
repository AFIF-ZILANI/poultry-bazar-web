import Link from "next/link";
import { Plus } from "lucide-react";

/** Floating sell button for phones (the header button covers md+). */
export function SellFab() {
  return (
    <Link
      href="/sell"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-30 inline-flex items-center gap-2 rounded-full bg-comb-600 py-3.5 pl-4 pr-5 text-[16px] font-semibold text-white shadow-[0_6px_20px_-6px_rgb(177_58_20/0.6)] md:hidden"
    >
      <Plus className="size-5" strokeWidth={2.5} aria-hidden />
      বিক্রি করুন
    </Link>
  );
}

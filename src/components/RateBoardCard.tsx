import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { getCategory, getRates } from "@/lib/api";
import { bn, dateBn, MOCK_NOW } from "@/lib/format";

/** The market chalkboard: today's average sold price per kg. Change is shown with sign, arrow and colour. */
export function RateBoardCard({ limit = 4 }: { limit?: number }) {
  const rates = getRates().slice(0, limit);
  return (
    <section aria-labelledby="board-title" className="rounded-2xl bg-field-900 p-5 text-white sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="board-title" className="text-[20px] font-bold">
          আজকের দর
        </h2>
        <p className="text-[13px] text-field-200">{dateBn(MOCK_NOW.toISOString())} · খামার থেকে, জীবিত ওজন</p>
      </div>
      <ul className="mt-4 divide-y divide-white/10">
        {rates.map((r) => {
          const c = getCategory(r.category)!;
          const diff = r.today - r.yesterday;
          return (
            <li key={r.category} className="flex items-center gap-3 py-3">
              <span className="flex-1 text-[16px] font-medium">{c.name}</span>
              <span className="num text-[24px] font-bold text-grain-400">
                ৳{bn(r.today)}
                <span className="ml-0.5 text-[13px] font-medium text-field-200">/কেজি</span>
              </span>
              <span
                className={`num inline-flex w-16 items-center justify-end gap-0.5 text-[14px] font-semibold ${diff > 0 ? "text-[#9be3b4]" : diff < 0 ? "text-[#ffb59a]" : "text-field-200"}`}
              >
                {diff > 0 ? <ArrowUpRight className="size-4" aria-hidden /> : diff < 0 ? <ArrowDownRight className="size-4" aria-hidden /> : <Minus className="size-4" aria-hidden />}
                <span className="sr-only">{diff > 0 ? "বেড়েছে" : diff < 0 ? "কমেছে" : "অপরিবর্তিত"}</span>
                {diff > 0 ? "+" : diff < 0 ? "−" : ""}
                {bn(Math.abs(diff))}
              </span>
            </li>
          );
        })}
      </ul>
      <Link href="/rates" className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-grain-400 hover:underline">
        সব দর ও ১৪ দিনের ওঠানামা দেখুন <ArrowRight className="size-4" aria-hidden />
      </Link>
      <p className="mt-2 text-[12px] text-field-200">গতকালের তুলনায়। বিক্রেতাদের জানানো বিক্রয়মূল্যের গড়।</p>
    </section>
  );
}

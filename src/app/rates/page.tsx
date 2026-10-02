import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { getCategory, getDivisions, getRates } from "@/lib/api";
import { bn, dateBn, MOCK_NOW } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { Sparkline } from "@/components/charts/Sparkline";
import { TrendChart } from "@/components/charts/TrendChart";
import { JsonLd } from "@/components/JsonLd";

const today = dateBn(MOCK_NOW.toISOString());

export const metadata: Metadata = {
  title: `আজকের মুরগীর দাম (${today}): ব্রয়লার, সোনালী, লেয়ার`,
  description: `আজ ${today} খামার পর্যায়ে ব্রয়লার, সোনালী, লেয়ার, দেশি মুরগী ও হাঁসের কেজিপ্রতি দর। বিভাগভিত্তিক দাম ও ১৪ দিনের ওঠানামা।`,
  alternates: { canonical: "/rates" },
};

function Change({ diff }: { diff: number }) {
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
  return (
    <span className={`num inline-flex items-center gap-0.5 font-semibold ${diff > 0 ? "text-ok" : diff < 0 ? "text-bad" : "text-muted"}`}>
      <Icon className="size-4" aria-hidden />
      <span className="sr-only">{diff > 0 ? "বেড়েছে" : diff < 0 ? "কমেছে" : "অপরিবর্তিত"}</span>
      {diff > 0 ? "+" : diff < 0 ? "−" : ""}
      {bn(Math.abs(diff))}
    </span>
  );
}

export default function RatesPage() {
  const rates = getRates();
  const divisions = getDivisions();

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Bangladesh farm-gate poultry prices (daily)",
          description: "Average reported sale price per kg (live weight) by category and division, last 14 days.",
          url: `${SITE_URL}/rates`,
          temporalCoverage: `${rates[0].series[0].date.slice(0, 10)}/${MOCK_NOW.toISOString().slice(0, 10)}`,
          spatialCoverage: "Bangladesh",
          variableMeasured: "Price per kilogram (BDT)",
          creator: { "@type": "Organization", name: "Poultry BAZAR" },
        }}
      />
      <p className="text-[14px] font-semibold text-brand-700">{today}, সকাল ৯টা পর্যন্ত হালনাগাদ</p>
      <h1 className="mt-1 text-[30px] font-extrabold text-brand-900 sm:text-[38px]">আজকের মুরগীর দর</h1>
      <p className="mt-2 max-w-[62ch] text-[16px] text-ink/80">
        খামার থেকে জীবিত ওজনে বিক্রির দর, কেজিপ্রতি। Poultry BAZAR-এ বিক্রেতারা ব্যাচ বিক্রির পর যে দাম জানান, গত ২৪ ঘণ্টার সেই দামের গড়।
        কোনো এলাকায় ৩টির কম বিক্রি হলে সেখানে দর দেখানো হয় না।
      </p>

      {/* National summary */}
      <section aria-labelledby="summary-title" className="mt-8">
        <h2 id="summary-title" className="text-[20px] font-bold">সারা দেশের গড়</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead className="border-b border-line text-[13px] text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">ধরন</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">আজ (৳/কেজি)</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">গতকালের তুলনায়</th>
                <th scope="col" className="px-4 py-3 font-semibold">১৪ দিন</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">বিক্রি (আজ)</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => {
                const c = getCategory(r.category)!;
                return (
                  <tr key={r.category} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3 font-semibold">
                      <Link href={`/category/${c.slug}`} className="hover:text-brand-700 hover:underline">{c.name}</Link>
                    </th>
                    <td className="num px-4 py-3 text-right text-[20px] font-bold">{bn(r.today)}</td>
                    <td className="px-4 py-3 text-right">
                      <Change diff={r.today - r.yesterday} />
                    </td>
                    <td className="px-4 py-2">
                      <Sparkline values={r.series.map((p) => p.price)} label={`${c.name}: ১৪ দিনে ৳${bn(r.series[0].price)} থেকে ৳${bn(r.today)}`} />
                    </td>
                    <td className="num px-4 py-3 text-right text-muted">{bn(r.sales)}টি</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* By division */}
      <section aria-labelledby="div-title" className="mt-10">
        <h2 id="div-title" className="text-[20px] font-bold">বিভাগ অনুযায়ী আজকের দর</h2>
        <p className="text-[15px] text-muted">৳/কেজি · “—” মানে আজ ৩টির কম বিক্রির তথ্য এসেছে</p>
        <div className="mt-3 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
          <table className="w-full min-w-[760px] text-[15px]">
            <thead className="border-b border-line text-[13px] text-muted">
              <tr>
                <th scope="col" className="sticky left-0 bg-surface px-4 py-3 text-left font-semibold">ধরন</th>
                {divisions.map((d) => (
                  <th key={d.slug} scope="col" className="px-3 py-3 text-right font-semibold">{d.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.category} className="border-b border-line last:border-0">
                  <th scope="row" className="sticky left-0 bg-surface px-4 py-3 text-left font-semibold">{getCategory(r.category)!.name}</th>
                  {r.byDivision.map((x) => (
                    <td key={x.division} className="num px-3 py-3 text-right">
                      {x.price ? bn(x.price) : <span className="text-muted" title={`${bn(x.sales)}টি বিক্রি`}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trends: one small chart per category, same axis style */}
      <section aria-labelledby="trend-title" className="mt-10">
        <h2 id="trend-title" className="text-[20px] font-bold">১৪ দিনের ওঠানামা</h2>
        <p className="text-[15px] text-muted">চার্টের উপর আঙুল বা মাউস রাখলে সেদিনের দর দেখাবে। প্রতিটি চার্টের নিজস্ব স্কেল।</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rates.map((r) => (
            <div key={r.category} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:p-5">
              <TrendChart points={r.series} title={getCategory(r.category)!.name} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-brand-900 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-[22px] font-bold">আপনার বিক্রির দর জানান, বাজার ঠিক থাকুক</h2>
          <p className="mt-1 text-[15px] text-brand-200">বিজ্ঞাপন “বিক্রি হয়েছে” করার সময় দর দিলে সেটি এই হিসাবে যোগ হয়। আপনার নাম বা নম্বর দেখানো হয় না।</p>
        </div>
        <Link href="/account" className="mt-4 inline-flex shrink-0 rounded-full bg-yolk-400 px-5 py-3 text-[15px] font-bold text-brand-950 hover:bg-yolk-500 sm:mt-0">
          আমার বিজ্ঞাপন
        </Link>
      </section>
    </div>
  );
}

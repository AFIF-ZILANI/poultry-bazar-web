import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "লোগো ও ব্র্যান্ড",
  description: "Poultry BAZAR লোগো ব্যবহারের নিয়ম, রং ও ফাইল।",
  robots: { index: false },
};

const VARIANTS = [
  { v: "tile", name: "টাইল", use: "অ্যাপ আইকন, ফেভিকন, সোশ্যাল প্রোফাইল ছবি", bg: "bg-surface" },
  { v: "bare", name: "মূল", use: "সাদা বা হালকা পটভূমিতে, নামের পাশে", bg: "bg-surface" },
  { v: "reverse", name: "উল্টো", use: "নীল বা গাঢ় পটভূমিতে", bg: "bg-brand-900" },
  { v: "mono", name: "এক রং", use: "রাবার স্ট্যাম্প, রসিদ, এক রঙের ছাপা", bg: "bg-surface" },
] as const;

const COLORS = [
  ["নীল (Indigo)", BRAND.indigo, "লোগোর মূল রং, বোতাম, লিংক"],
  ["গাঢ় নীল", BRAND.indigoDeep, "গাঢ় পটভূমি, ফুটার"],
  ["সিঁদুরে লাল (Vermilion)", BRAND.vermilion, "ঝুঁটি, “বিক্রি করুন” বোতাম"],
  ["ডিমের কুসুম (Yolk)", BRAND.yolk, "ঠোঁট, নীলের উপর দাম"],
  ["কাগজ (Paper)", BRAND.paper, "পাতার পটভূমি"],
] as const;

const DONTS = [
  { label: "বাঁকানো বা চ্যাপ্টা করবেন না", style: { transform: "scaleX(1.5)" } },
  { label: "সোজা করবেন না, হেলানো ভঙ্গিই লোগো", style: { transform: "rotate(18deg)" } },
  { label: "রং বদলাবেন না", style: { filter: "hue-rotate(110deg)" } },
  { label: "ছায়া বা গ্লো দেবেন না", style: { filter: "drop-shadow(0 6px 6px rgb(0 0 0 / .5))" } },
] as const;

export default function BrandPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <p className="text-[14px] font-semibold text-brand-700">ব্র্যান্ড গাইড</p>
      <h1 className="mt-1 text-[34px] font-extrabold text-brand-900 sm:text-[42px]">দামের ট্যাগে আঁকা মুরগী</h1>
      <p className="mt-3 max-w-[62ch] text-[17px] text-ink/80">
        Poultry BAZAR-এর লোগো একটি দামের ট্যাগ, যেটা একই সাথে একটা মুরগী। ট্যাগের সরু মাথাটা মুরগীর মাথা, সুতো বাঁধার ফুটোটা তার চোখ।
        এক নজরে বোঝায়: মুরগী, আর তার ন্যায্য দাম। সামনে একটু হেলানো, যেন বাজারের দিকে এগোচ্ছে।
      </p>

      {/* Hero lockups */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="grid min-h-48 place-items-center rounded-2xl border border-line bg-surface p-8">
          <div className="origin-center scale-[1.6]">
            <Logo />
          </div>
        </div>
        <div className="grid min-h-48 place-items-center rounded-2xl bg-brand-900 p-8">
          <div className="origin-center scale-[1.6]">
            <Logo inverted />
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <section className="mt-14 grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="relative mx-auto w-full max-w-sm">
          <LogoMark variant="bare" className="w-full" title="Poultry BAZAR লোগো" />
        </div>
        <div>
          <h2 className="text-[24px] font-bold">লোগোর ভেতরে কী আছে</h2>
          <ul className="mt-4 space-y-3 text-[16px]">
            {[
              [BRAND.indigo, "দামের ট্যাগ = মুরগীর শরীর", "বাজার, দরদাম, ন্যায্য মূল্য।"],
              [BRAND.paper, "ট্যাগের ফুটো = চোখ", "সুতোর ফুটো, যেটা ছাড়া ট্যাগ চেনা যায় না।"],
              [BRAND.vermilion, "তিন খাঁজের ঝুঁটি", "দেশি মোরগের চেনা ঝুঁটি, সবচেয়ে ছোট আকারেও দেখা যায়।"],
              [BRAND.yolk, "ঠোঁট", "ডিমের কুসুমের রং, ট্যাগের মাথায়।"],
            ].map(([c, t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 size-5 shrink-0 rounded-md ring-1 ring-line" style={{ background: c }} />
                <span>
                  <b>{t}</b> <span className="text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Variants */}
      <section className="mt-14">
        <h2 className="text-[24px] font-bold">চারটি রূপ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VARIANTS.map((x) => (
            <div key={x.v} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className={`grid h-44 place-items-center ${x.bg}`}>
                <LogoMark variant={x.v} className={x.v === "tile" ? "size-24" : "h-24 w-28"} />
              </div>
              <div className="border-t border-line p-4">
                <p className="text-[17px] font-bold">{x.name}</p>
                <p className="text-[14px] text-muted">{x.use}</p>
                <a href={`/brand/mark-${x.v}.svg`} download className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 hover:underline">
                  <Download className="size-4" aria-hidden /> SVG
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section className="mt-14">
        <h2 className="text-[24px] font-bold">ছোট-বড় সব আকারে</h2>
        <p className="mt-1 text-[15px] text-muted">সবচেয়ে ছোট: ১৬ পিক্সেল (ব্রাউজার ট্যাব)। ছাপায় অন্তত ৮ মিমি।</p>
        <div className="mt-4 flex flex-wrap items-end gap-6 rounded-2xl border border-line bg-surface p-6">
          {[16, 24, 32, 48, 64, 96, 128].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span style={{ width: s, height: s }} className="block">
                <LogoMark variant="tile" className="h-full w-full" />
              </span>
              <span className="num text-[12px] text-muted">{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* Clear space + don'ts */}
      <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-[24px] font-bold">চারপাশে ফাঁকা জায়গা</h2>
          <p className="mt-1 text-[15px] text-muted">লোগোর চারদিকে অন্তত ঝুঁটির উচ্চতার সমান জায়গা খালি রাখুন। কোনো লেখা বা ছবি সেখানে ঢুকবে না।</p>
          <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-10">
            <div className="outline-dashed outline-1 outline-offset-[18px] outline-brand-600">
              <LogoMark variant="bare" className="h-20 w-24" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-[24px] font-bold">যা করবেন না</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {DONTS.map((d) => (
              <div key={d.label} className="rounded-2xl border border-line bg-surface p-4">
                <div className="relative grid h-24 place-items-center">
                  <span style={d.style} className="block">
                    <LogoMark variant="bare" className="h-16 w-20" />
                  </span>
                  <span className="absolute inset-0 grid place-items-center text-[64px] font-thin leading-none text-bad/70" aria-hidden>
                    ╳
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-medium">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colours */}
      <section className="mt-14">
        <h2 className="text-[24px] font-bold">রং</h2>
        <p className="mt-1 text-[15px] text-muted">রিকশা আর ট্রাকের রং থেকে নেওয়া। সবুজ ব্যবহার হয় না।</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COLORS.map(([n, hex, use]) => (
            <div key={hex} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="h-24" style={{ background: hex }} />
              <div className="p-4">
                <p className="text-[15px] font-bold">{n}</p>
                <p className="num select-all text-[14px] text-muted">{hex}</p>
                <p className="mt-1 text-[13px] text-muted">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

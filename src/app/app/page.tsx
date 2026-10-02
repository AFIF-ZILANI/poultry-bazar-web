import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { BellRing, Camera, LocateFixed, PhoneCall, ShieldCheck, TrendingUp } from "lucide-react";
import { APP, SITE_URL } from "@/lib/site";
import { toBnDigits } from "@/lib/format";
import { AppButtons } from "@/components/app/AppButtons";
import { PhoneMockup } from "@/components/app/PhoneMockup";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Poultry BAZAR অ্যাপ ডাউনলোড (Android)",
  description: `Poultry BAZAR Android অ্যাপ, সংস্করণ ${APP.version}। ফোন থেকেই মুরগী বিক্রির বিজ্ঞাপন দিন, আজকের দর দেখুন, পাইকারকে সরাসরি কল করুন। বিনামূল্যে।`,
  alternates: { canonical: "/app" },
};

const FEATURES = [
  [Camera, "ক্যামেরা থেকে সরাসরি ছবি", "শেডে দাঁড়িয়েই ছবি তুলে বিজ্ঞাপন দিন। গ্যালারিতে খুঁজতে হবে না।"],
  [LocateFixed, "এলাকা নিজে থেকে বসে যায়", "অনুমতি দিলে বিভাগ, জেলা, উপজেলা নিজে থেকে পূরণ হয়। না দিলে হাতে বেছে নিন।"],
  [TrendingUp, "প্রতিদিনের দর", "বিক্রির আগে দেখে নিন আপনার এলাকায় আজ কেজিপ্রতি কত দরে বিক্রি হচ্ছে।"],
  [PhoneCall, "এক চাপে কল", "পছন্দের ব্যাচ পেলে সরাসরি বিক্রেতাকে কল বা হোয়াটসঅ্যাপ করুন।"],
  [BellRing, "নোটিশ ও খবর", "দাম, রোগ সতর্কতা বা নতুন ফিচারের খবর অ্যাপের নোটিশে পাবেন।"],
  [ShieldCheck, "একই অ্যাকাউন্ট", "ওয়েবসাইট আর অ্যাপে একই মোবাইল নম্বর ও পাসওয়ার্ড। বিজ্ঞাপন দুই জায়গাতেই দেখা যায়।"],
] as const;

const STEPS = [
  ["APK ডাউনলোড করুন", "উপরের “Android অ্যাপ ডাউনলোড” বোতামে চাপুন। ফাইলটি ফোনের Downloads-এ জমা হবে।"],
  ["ফাইলটি খুলুন", "নোটিফিকেশন থেকে বা Files › Downloads থেকে poultry-bazar ফাইলে চাপুন।"],
  ["ইনস্টলের অনুমতি দিন", "ফোন জিজ্ঞেস করলে Settings-এ গিয়ে আপনার ব্রাউজারের জন্য “Allow from this source” চালু করুন। এটা শুধু এই একবার।"],
  ["Install চাপুন, তারপর খুলুন", "ইনস্টল শেষ হলে Open চাপুন এবং আপনার মোবাইল নম্বর দিয়ে লগইন করুন।"],
];

const FAQ = [
  ["অ্যাপ কি বিনামূল্যে?", "হ্যাঁ। অ্যাপ, বিজ্ঞাপন দেওয়া, দর দেখা সবই বিনামূল্যে। আমরা কোনো লেনদেন থেকে কমিশন নিই না।"],
  ["Google Play-তে নেই কেন?", "Play Store-এ প্রকাশের কাজ চলছে। ততদিন এই পাতা থেকে নেওয়া APK নিরাপদ। অন্য কোথাও, বিশেষ করে হোয়াটসঅ্যাপে পাঠানো APK ইনস্টল করবেন না।"],
  ["আইফোনে কি চলবে?", "এখনো না। আইফোন থেকে এই ওয়েবসাইটেই সব কাজ করা যায়: বিজ্ঞাপন দেওয়া, দর দেখা, কল করা।"],
  ["কত ইন্টারনেট খরচ হয়?", "ছবি আপলোডের আগে ছোট করা হয়, তাই একটি বিজ্ঞাপন দিতে সাধারণত কয়েক মেগাবাইটের বেশি লাগে না।"],
  ["নতুন সংস্করণ কীভাবে পাব?", "নতুন সংস্করণ এলে এই পাতায় জানানো হবে। এখান থেকে আবার ডাউনলোড করে ইনস্টল করলেই আপডেট হয়ে যাবে, আপনার বিজ্ঞাপন বা অ্যাকাউন্ট মুছবে না।"],
];

export default async function AppPage() {
  const qr = await QRCode.toString(APP.pageUrl, { type: "svg", margin: 0, color: { dark: "#0F3D24", light: "#00000000" } });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          name: "Poultry BAZAR",
          operatingSystem: "Android",
          applicationCategory: "BusinessApplication",
          softwareVersion: APP.version,
          downloadUrl: APP.apkUrl,
          url: `${SITE_URL}/app`,
          inLanguage: "bn-BD",
          offers: { "@type": "Offer", price: 0, priceCurrency: "BDT" },
        }}
      />

      <section className="overflow-hidden bg-field-900 text-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-wider text-grain-400">Android অ্যাপ</p>
            <h1 className="mt-2 text-[38px] font-extrabold leading-[1.1] sm:text-[52px]">
              খামারে দাঁড়িয়েই
              <br />
              বিজ্ঞাপন দিন
            </h1>
            <p className="mt-4 max-w-[48ch] text-[17px] text-field-100">
              ছবি তুলুন, সংখ্যা আর ওজন লিখুন, ব্যস। আজকের দর, পাইকারের চাহিদা আর আপনার সব বিজ্ঞাপন এক অ্যাপে, কম ইন্টারনেটেও চলে।
            </p>
            <div className="mt-7">
              <AppButtons dark />
            </div>
            <p className="mt-4 text-[14px] text-field-200">
              শুধু poultrybazarbd.com থেকে ডাউনলোড করুন। আমরা কখনো হোয়াটসঅ্যাপ বা মেসেঞ্জারে APK পাঠাই না।
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-x-10 bottom-0 top-10 rounded-full bg-field-700/40 blur-3xl" aria-hidden />
            <PhoneMockup className="relative" />
          </div>
        </div>
      </section>

      <section aria-labelledby="feat-title" className="mx-auto max-w-[1200px] px-4 pt-14 md:px-6">
        <h2 id="feat-title" className="text-[26px] font-bold">অ্যাপে যা পাবেন</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([Icon, t, d]) => (
            <li key={t} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-field-100 text-field-800">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-[18px] font-bold">{t}</h3>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="install-title" className="mx-auto mt-14 grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 id="install-title" className="text-[24px] font-bold">কীভাবে ইনস্টল করবেন</h2>
          <p className="mt-1 text-[15px] text-muted">Play Store ছাড়া প্রথমবার ইনস্টল করলে ফোন একটি অনুমতি চায়। এতে ভয়ের কিছু নেই।</p>
          <ol className="mt-6 space-y-5">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="num grid size-9 shrink-0 place-items-center rounded-full bg-field-700 text-[17px] font-bold text-white">{toBnDigits(i + 1)}</span>
                <div>
                  <h3 className="text-[17px] font-bold">{t}</h3>
                  <p className="text-[15px] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[15px]">
            সমস্যা হলে{" "}
            <Link href="/contact" className="font-semibold text-field-700 underline">
              আমাদের সাথে যোগাযোগ করুন
            </Link>
            , ফোনে ধাপে ধাপে সাহায্য করব।
          </p>
        </div>

        <aside className="flex flex-col items-center justify-center rounded-2xl bg-field-50 p-8 text-center">
          <h2 className="text-[20px] font-bold">কম্পিউটার থেকে দেখছেন?</h2>
          <p className="mt-1 text-[15px] text-muted">ফোনের ক্যামেরা দিয়ে স্ক্যান করুন, এই পাতা ফোনে খুলবে।</p>
          <div className="mt-5 size-44 rounded-2xl bg-surface p-4 shadow-[var(--shadow-lift)] [&>svg]:size-full" role="img" aria-label="poultrybazarbd.com/app এর QR কোড" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="mt-4 font-display text-[16px] font-semibold text-field-900">poultrybazarbd.com/app</p>
        </aside>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto mt-14 max-w-3xl px-4 md:px-6">
        <h2 id="faq-title" className="text-[24px] font-bold">প্রশ্ন ও উত্তর</h2>
        <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                {q}
                <span className="text-[22px] leading-none text-field-700 transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 text-[16px] text-ink/80">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, PhoneCall, ShieldAlert, Smartphone } from "lucide-react";
import { getCategories, getDistricts, getWanted, searchAds } from "@/lib/api";
import { bn } from "@/lib/format";
import type { CategorySlug } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { SearchBox } from "@/components/SearchBox";
import { RateBoardCard } from "@/components/RateBoardCard";
import { ListingCard } from "@/components/ListingCard";
import { WantedCard } from "@/components/WantedCard";
import { FlockArt } from "@/components/FlockArt";
import { SellFab } from "@/components/SellFab";
import { JsonLd } from "@/components/JsonLd";
import { AppButtons } from "@/components/app/AppButtons";
import { PhoneMockup } from "@/components/app/PhoneMockup";

export default function HomePage() {
  const latest = searchAds({ sort: "newest" });
  const cats = getCategories();
  const wanted = getWanted().slice(0, 3);
  const activeCount = (slug: CategorySlug) => searchAds({ category: slug }).total;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Poultry BAZAR",
            url: SITE_URL,
            logo: `${SITE_URL}/brand/logo-mark.svg`,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Poultry BAZAR",
            url: SITE_URL,
            inLanguage: "bn-BD",
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/ads?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />

      {/* Hero: search on the left, the market's rate board on the right */}
      <section className="border-b border-line bg-[linear-gradient(180deg,var(--color-surface)_0%,var(--color-paper)_100%)]">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 md:px-6 md:py-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <p className="text-[14px] font-semibold text-field-700">
              আজ {bn(latest.total)}টি ব্যাচ বিক্রির জন্য তৈরি
            </p>
            <h1 className="mt-2 text-[34px] font-extrabold leading-[1.15] text-field-900 sm:text-[44px]">
              খামার থেকে সরাসরি
              <br />
              মুরগী কেনাবেচা
            </h1>
            <p className="mt-3 max-w-[52ch] text-[17px] text-ink/80">
              ব্রয়লার, সোনালী, লেয়ার, দেশি মুরগী ও হাঁস। ওজন, বয়স, দর আর এলাকা দেখে ঠিক করুন, তারপর সরাসরি খামারিকে কল করুন।
              কোনো কমিশন নেই।
            </p>
            <div className="mt-6">
              <SearchBox />
            </div>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="জনপ্রিয় খোঁজ">
              {[
                ["ব্রয়লার, গাজীপুর", "/ads?category=broiler&district=gazipur"],
                ["সোনালী", "/category/sonali"],
                ["২ কেজির বেশি", "/ads?minWeight=2000"],
                ["হাঁস", "/category/duck"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-[14px] hover:border-field-700 hover:text-field-800">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/app" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-field-700 hover:underline">
              <Smartphone className="size-4" aria-hidden /> Android অ্যাপ ডাউনলোড করুন
            </Link>
          </div>
          <RateBoardCard />
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="cat-title" className="mx-auto max-w-[1200px] px-4 pt-10 md:px-6">
        <h2 id="cat-title" className="text-[24px] font-bold">
          কোন মুরগী খুঁজছেন?
        </h2>
        <ul className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0">
          {cats.map((c, i) => (
            <li key={c.slug} className="w-[140px] shrink-0 snap-start md:w-auto">
              <Link href={`/category/${c.slug}`} className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface hover:border-field-700">
                <FlockArt category={c.slug} seed={i * 7 + 3} variant={i} className="aspect-[5/3] w-full" label={false} />
                <span className="block px-3 pb-3 pt-2">
                  <span className="block text-[16px] font-bold group-hover:text-field-800">{c.name}</span>
                  <span className="text-[13px] text-muted">{bn(activeCount(c.slug))}টি বিজ্ঞাপন</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Latest listings */}
      <section aria-labelledby="latest-title" className="mx-auto max-w-[1200px] px-4 pt-12 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="latest-title" className="text-[24px] font-bold">
              নতুন বিজ্ঞাপন
            </h2>
            <p className="text-[15px] text-muted">সর্বশেষ পোস্ট করা ব্যাচ, সময় অনুযায়ী</p>
          </div>
          <Link href="/ads" className="inline-flex shrink-0 items-center gap-1 text-[15px] font-semibold text-field-700 hover:underline">
            সব {bn(latest.total)}টি দেখুন <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {latest.items.slice(0, 8).map((ad) => (
            <ListingCard key={ad.code} ad={ad} />
          ))}
        </div>
      </section>

      {/* Demand + how selling works */}
      <section className="mx-auto mt-14 grid max-w-[1200px] gap-8 px-4 md:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[24px] font-bold">পাইকাররা যা কিনতে চান</h2>
              <p className="text-[15px] text-muted">আপনার ব্যাচ মিললে সরাসরি যোগাযোগ করুন</p>
            </div>
            <Link href="/wanted" className="inline-flex shrink-0 items-center gap-1 text-[15px] font-semibold text-field-700 hover:underline">
              সব চাহিদা <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {wanted.map((w) => (
              <WantedCard key={w.id} w={w} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-[22px] font-bold">বিক্রি করবেন? ৩ ধাপে বিজ্ঞাপন</h2>
          <ol className="mt-5 space-y-5">
            {[
              ["ব্যাচের তথ্য দিন", "মুরগীর ধরন, সংখ্যা, গড় ওজন আর বয়স। বাংলা বা ইংরেজি দুই সংখ্যাই চলবে।"],
              ["দর ও এলাকা", "চাইলে কেজিপ্রতি দর দিন, এলাকার আজকের দর পাশে দেখতে পাবেন। ১টি ছবি হলেই চলবে।"],
              ["কল আসবে সরাসরি", "পাইকার আপনার নম্বরে কল বা হোয়াটসঅ্যাপ করবেন। বিক্রি হলে দর জানিয়ে দিন।"],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="num grid size-9 shrink-0 place-items-center rounded-full bg-field-100 text-[17px] font-bold text-field-800">
                  {bn(i + 1)}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold">{t}</h3>
                  <p className="text-[15px] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/sell" className="mt-6 flex items-center justify-center rounded-full bg-comb-600 py-3.5 text-[16px] font-semibold text-white hover:bg-comb-700">
            বিজ্ঞাপন দিন, বিনামূল্যে
          </Link>
        </div>
      </section>

      {/* App download band */}
      <section aria-labelledby="app-title" className="mx-auto mt-14 max-w-[1200px] px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-field-900 text-white">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-grain-400">Android অ্যাপ</p>
              <h2 id="app-title" className="mt-1 text-[28px] font-extrabold leading-tight sm:text-[34px]">
                শেডে দাঁড়িয়েই ছবি তুলে বিজ্ঞাপন দিন
              </h2>
              <p className="mt-3 max-w-[50ch] text-[16px] text-field-100">
                Poultry BAZAR অ্যাপে আজকের দর, পাইকারের চাহিদা আর আপনার সব বিজ্ঞাপন এক জায়গায়। ওয়েবসাইটের একই অ্যাকাউন্টে চলে।
              </p>
              <div className="mt-6">
                <AppButtons dark />
              </div>
              <Link href="/app" className="mt-4 inline-flex items-center gap-1 text-[15px] font-semibold text-grain-400 hover:underline">
                ইনস্টল করার নিয়ম ও বিস্তারিত <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="hidden h-[300px] lg:block">
              <PhoneMockup className="origin-top scale-[0.82]" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section aria-labelledby="trust-title" className="mx-auto mt-14 max-w-[1200px] px-4 md:px-6">
        <h2 id="trust-title" className="sr-only">
          কেন Poultry BAZAR
        </h2>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            [PhoneCall, "সরাসরি যোগাযোগ", "খামারি ও পাইকারের মাঝে কোনো মধ্যস্বত্বভোগী নেই।"],
            [HandCoins, "আসল বিক্রয়মূল্য", "বিক্রেতারা বিক্রির পর দর জানান, সেখান থেকেই আজকের দর।"],
            [BadgeCheck, "যাচাইকৃত বিক্রেতা", "মোবাইল যাচাই ও আগের বিক্রির রেকর্ড দেখে ব্যাজ।"],
            [ShieldAlert, "প্রতারণা থেকে সাবধান", "অগ্রিম টাকা পাঠাবেন না। খামারে গিয়ে দেখে কিনুন।"],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof PhoneCall;
            return (
              <li key={t as string} className="bg-surface p-5">
                <I className="size-6 text-field-700" aria-hidden />
                <h3 className="mt-3 text-[17px] font-bold">{t as string}</h3>
                <p className="mt-1 text-[15px] text-muted">{d as string}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Districts (crawlable entry points) */}
      <section aria-labelledby="dist-title" className="mx-auto mt-14 max-w-[1200px] px-4 md:px-6">
        <h2 id="dist-title" className="text-[20px] font-bold">
          জেলা অনুযায়ী মুরগী বিক্রি
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {getDistricts().map((d) => (
            <li key={d.slug}>
              <Link href={`/district/${d.slug}`} className="inline-block rounded-lg border border-line bg-surface px-3 py-1.5 text-[15px] hover:border-field-700 hover:text-field-800">
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SellFab />
    </>
  );
}

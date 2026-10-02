import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Info, MapPin, ShieldAlert, TriangleAlert } from "lucide-react";
import { getAd, getAllAds, getCategory, getDistrict, getDivision, getReferenceRate, getSeller, getSimilar } from "@/lib/api";
import { age, bn, dateBnYear, kg, perKg, relativeTime, timeLeft, totalKg } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { Gallery } from "@/components/detail/Gallery";
import { ContactPanel } from "@/components/detail/ContactPanel";
import { HealthBadge, VerifiedBadge } from "@/components/Badges";
import { ListingCard } from "@/components/ListingCard";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllAds().map((a) => ({ code: a.code }));
}

function titleFor(code: string) {
  const ad = getAd(code)!;
  const c = getCategory(ad.category)!;
  const d = getDistrict(ad.district)!;
  return `${c.name} ${bn(ad.birdCount)} পিছ · ${kg(ad.avgWeightG)} · ${d.name}`;
}

export async function generateMetadata(props: PageProps<"/ads/[code]">): Promise<Metadata> {
  const { code } = await props.params;
  const ad = getAd(code);
  if (!ad) return { title: "বিজ্ঞাপন পাওয়া যায়নি" };
  const d = getDistrict(ad.district)!;
  const price = ad.pricePerKg ? `দর ${perKg(ad.pricePerKg)}` : "দরদাম সাপেক্ষে";
  return {
    title: titleFor(code),
    description: `${titleFor(code)}। বয়স ${age(ad.ageDays)}, মোট প্রায় ${bn(totalKg(ad.birdCount, ad.avgWeightG))} কেজি, ${price}। ${ad.upazila}, ${d.name}। বিজ্ঞাপন ${ad.code}।`,
    alternates: { canonical: `/ads/${ad.code}` },
    openGraph: { type: "website", url: `/ads/${ad.code}` },
  };
}

export default async function AdPage(props: PageProps<"/ads/[code]">) {
  const { code } = await props.params;
  const ad = getAd(code);
  if (!ad) notFound();

  const cat = getCategory(ad.category)!;
  const dist = getDistrict(ad.district)!;
  const div = getDivision(dist.division)!;
  const seller = getSeller(ad.sellerId)!;
  const ref = getReferenceRate(ad.category, ad.district);
  const similar = getSimilar(ad);
  const sold = ad.status === "SOLD";
  const expired = ad.status === "EXPIRED";
  const total = totalKg(ad.birdCount, ad.avgWeightG);
  const seed = Number(ad.code.replace(/\D/g, ""));

  const facts: [string, string][] = [
    ["মুরগীর সংখ্যা", `${bn(ad.birdCount)} পিছ`],
    ["গড় ওজন", kg(ad.avgWeightG)],
    ["মোট ওজন (প্রায়)", `${bn(total)} কেজি`],
    ["বয়স", age(ad.ageDays)],
    ["এলাকা", `${ad.village}, ${ad.upazila}, ${dist.name}`],
    ["পোস্ট", relativeTime(ad.postedAt)],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-4 md:px-6 md:pt-6">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: titleFor(ad.code),
            sku: ad.code,
            category: cat.nameEn,
            image: `${SITE_URL}/ads/${ad.code}/opengraph-image`,
            description: ad.note || `${cat.nameEn} chickens, ${ad.birdCount} birds, avg ${ad.avgWeightG} g, ${ad.ageDays} days, ${dist.nameEn}.`,
            offers: {
              "@type": "Offer",
              priceCurrency: "BDT",
              ...(ad.pricePerKg ? { price: ad.pricePerKg, unitText: "KGM" } : {}),
              availability: sold ? "https://schema.org/SoldOut" : expired ? "https://schema.org/Discontinued" : "https://schema.org/InStock",
              areaServed: dist.nameEn,
              seller: { "@type": "Person", name: seller.name },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE_URL}/category/${cat.slug}` },
              { "@type": "ListItem", position: 3, name: dist.name, item: `${SITE_URL}/district/${dist.slug}` },
              { "@type": "ListItem", position: 4, name: ad.code },
            ],
          },
        ]}
      />

      <nav aria-label="অবস্থান" className="text-[14px] text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">হোম</Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link href={`/category/${cat.slug}`} className="hover:text-ink hover:underline">{cat.name}</Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link href={`/district/${dist.slug}`} className="hover:text-ink hover:underline">{dist.name}</Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="font-display font-semibold text-ink">{ad.code}</li>
        </ol>
      </nav>

      {(sold || expired) && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-grain-100 px-4 py-3 text-[15px] font-medium text-[#5c4400]">
          <Info className="size-5 shrink-0" aria-hidden />
          {sold
            ? `এই ব্যাচ বিক্রি হয়ে গেছে${ad.soldPricePerKg ? `, বিক্রয়মূল্য ${perKg(ad.soldPricePerKg)}` : ""}। নিচে একই রকম বিজ্ঞাপন দেখুন।`
            : "এই বিজ্ঞাপনের মেয়াদ শেষ। বিক্রেতা আবার পোস্ট করলে এখানে দেখা যাবে।"}
        </p>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[7fr_5fr] lg:gap-8">
        <div className="min-w-0">
          <Gallery category={ad.category} seed={seed} photos={ad.photos} alt={`${cat.name}, বিজ্ঞাপন ${ad.code}-এর ছবি`} />
        </div>

        <aside className="min-w-0 lg:row-span-2">
          <div className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-field-100 px-2 py-0.5 font-display text-[13px] font-semibold tracking-wide text-field-800">{ad.code}</span>
                <HealthBadge health={ad.health} />
              </div>
              <h1 className="mt-3 text-[26px] font-extrabold leading-tight sm:text-[30px]">
                {cat.name}, {bn(ad.birdCount)} পিছ
              </h1>
              <p className="mt-1 flex items-center gap-1 text-[15px] text-muted">
                <MapPin className="size-4" aria-hidden /> {ad.upazila}, {dist.name} · {div.name} বিভাগ
              </p>

              <div className="mt-4 rounded-xl bg-paper p-4">
                {ad.pricePerKg ? (
                  <p className="num text-[30px] font-extrabold leading-none text-comb-700">
                    {perKg(ad.pricePerKg)}
                  </p>
                ) : (
                  <p className="text-[22px] font-bold">দরদাম সাপেক্ষে</p>
                )}
                {ad.pricePerKg ? (
                  <p className="mt-1.5 text-[14px] text-muted">
                    পুরো ব্যাচ প্রায় <span className="num font-semibold text-ink">৳{bn(total * ad.pricePerKg)}</span>
                  </p>
                ) : null}
                <p className="mt-2 border-t border-line pt-2 text-[14px] text-muted">
                  আজকের গড় দর ({ref.scope}): <span className="num font-semibold text-ink">{perKg(ref.price)}</span>{" "}
                  <Link href="/rates" className="text-field-700 underline-offset-2 hover:underline">দর দেখুন</Link>
                </p>
              </div>

              {!sold && !expired && (
                <p className="mt-3 flex items-center gap-1.5 text-[14px] text-muted">
                  <CalendarDays className="size-4" aria-hidden /> বিজ্ঞাপনের মেয়াদ: {timeLeft(ad.expiresAt)}
                </p>
              )}
            </section>

            <section aria-labelledby="seller-title" className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <h2 id="seller-title" className="sr-only">বিক্রেতা</h2>
              <div className="flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-field-100 font-display text-[20px] font-bold text-field-800" aria-hidden>
                  {seller.name.replace("মোঃ ", "").slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="text-[17px] font-bold">{seller.name}</p>
                  <p className="text-[14px] text-muted">
                    সদস্য {dateBnYear(seller.memberSince)} থেকে · {seller.soldCount ? `${bn(seller.soldCount)}টি ব্যাচ বিক্রি` : "নতুন বিক্রেতা"}
                  </p>
                  {seller.verified && (
                    <div className="mt-1.5">
                      <VerifiedBadge small />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <ContactPanel code={ad.code} phonePrefix={seller.phone.slice(0, 5)} sellerName={seller.name.split(" ").slice(-1)[0]} sold={sold} />
              </div>
            </section>

            <p className="flex gap-2 rounded-xl border border-comb-100 bg-comb-50 p-4 text-[14px] text-[#7a2a0e]">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
              <span>
                অগ্রিম টাকা পাঠাবেন না। খামারে গিয়ে মুরগী দেখে, ওজন মেপে তারপর টাকা দিন।{" "}
                <Link href="/safety" className="font-semibold underline">নিরাপদ কেনাবেচা</Link>
              </span>
            </p>
          </div>
        </aside>

        <section aria-labelledby="facts-title" className="min-w-0">
          <h2 id="facts-title" className="text-[20px] font-bold">ব্যাচের বিবরণ</h2>
          <dl className="mt-3 grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <dt className="text-[15px] text-muted">{k}</dt>
                <dd className="num text-right text-[16px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {ad.health === "SICK" && (
            <p className="mt-3 flex gap-2 rounded-xl bg-bad-50 p-4 text-[15px] text-bad">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
              বিক্রেতা জানিয়েছেন ব্যাচে অসুস্থ মুরগী আছে। কেনার আগে ভেটেরিনারি পরামর্শ নিন।
            </p>
          )}
          {ad.note && (
            <div className="mt-4">
              <h3 className="text-[16px] font-bold">বিক্রেতার কথা</h3>
              <p className="mt-1 text-[16px]">{ad.note}</p>
            </div>
          )}
          <p className="mt-4 text-[14px] text-muted">
            সাধারণত {cat.name} {cat.typicalAge} বয়সে {cat.typicalWeight} ওজনে বিক্রি হয়।
          </p>
        </section>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 id="similar-title" className="text-[22px] font-bold">
              একই রকম আরও {cat.name}
            </h2>
            <Link href={`/category/${cat.slug}`} className="text-[15px] font-semibold text-field-700 hover:underline">
              সব দেখুন
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {similar.map((s) => (
              <ListingCard key={s.code} ad={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

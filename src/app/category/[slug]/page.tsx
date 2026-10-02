import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategory, getRate, searchAds } from "@/lib/api";
import { bn, perKg } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { ListingsView } from "@/components/listings/ListingsView";
import { JsonLd } from "@/components/JsonLd";
import { SellFab } from "@/components/SellFab";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCategory(slug);
  if (!c) return {};
  const r = getRate(c.slug);
  const total = searchAds({ category: c.slug }).total;
  return pageMeta({
    title: `${c.name} মুরগী বিক্রি: আজকের দর ${perKg(r.today)}`,
    description: `${c.name} মুরগীর ${bn(total)}টি চালু বিজ্ঞাপন। আজকের গড় দর ${perKg(r.today)}। সাধারণ ওজন ${c.typicalWeight}, বয়স ${c.typicalAge}। খামার থেকে সরাসরি কিনুন।`,
    path: `/category/${c.slug}`,
    // A landing page with no live listings is thin content: keep it reachable, keep it out of the index.
    noindex: total === 0,
  });
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const c = getCategory(slug);
  if (!c) notFound();
  const r = getRate(c.slug);
  const items = searchAds({ category: c.slug }).items.slice(0, 10);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${c.name} মুরগী বিক্রি`,
          url: `${SITE_URL}/category/${c.slug}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: items.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/ads/${a.code}` })),
          },
        }}
      />
      <ListingsView
        f={{ category: c.slug }}
        heading={`${c.name} মুরগী বিক্রি`}
        intro={
          <div className="mt-3 space-y-3">
            <p className="text-[16px] text-ink/80">{c.blurb}</p>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
              <span>
                আজকের দর: <Link href="/rates" className="num font-bold text-comb-700 hover:underline">{perKg(r.today)}</Link>
              </span>
              <span className="text-muted">সাধারণ ওজন {c.typicalWeight}</span>
              <span className="text-muted">বয়স {c.typicalAge}</span>
            </p>
          </div>
        }
      />
      <SellFab />
    </>
  );
}

import type { Metadata } from "next";
import { filtersToQuery, parseFilters, searchAds } from "@/lib/api";
import { bn } from "@/lib/format";
import { ListingsView, describeFilters } from "@/components/listings/ListingsView";
import { SellFab } from "@/components/SellFab";

/** Canonical rule (docs/seo.md): exactly one category or district filter → its landing page. */
function canonicalFor(f: ReturnType<typeof parseFilters>) {
  const set = Object.entries(f).filter(([k, v]) => v !== undefined && k !== "sort" && k !== "page");
  if (set.length === 1 && f.category) return `/category/${f.category}`;
  if (set.length === 1 && f.district) return `/district/${f.district}`;
  return f.page && f.page > 1 && set.length === 0 ? `/ads?page=${f.page}` : "/ads";
}

export async function generateMetadata(props: PageProps<"/ads">): Promise<Metadata> {
  const f = parseFilters(await props.searchParams);
  const total = searchAds(f).total;
  const what = describeFilters(f);
  return {
    title: `${what} বিক্রির বিজ্ঞাপন (${bn(total)}টি)`,
    description: `${what}: ${bn(total)}টি চালু বিজ্ঞাপন। সংখ্যা, গড় ওজন, বয়স, দর ও এলাকা দেখে সরাসরি খামারির সাথে যোগাযোগ করুন।`,
    alternates: { canonical: canonicalFor(f) },
    robots: f.q ? { index: false, follow: true } : undefined,
  };
}

export default async function AdsPage(props: PageProps<"/ads">) {
  const f = parseFilters(await props.searchParams);
  const heading = f.q ? `“${f.q}” এর ফলাফল` : `${describeFilters(f)} বিক্রির বিজ্ঞাপন`;
  return (
    <>
      <ListingsView f={f} heading={heading} key={filtersToQuery(f)} />
      <SellFab />
    </>
  );
}

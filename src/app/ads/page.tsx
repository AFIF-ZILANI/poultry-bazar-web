import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { filtersToQuery, parseFilters, searchAds } from "@/lib/api";
import { bn } from "@/lib/format";
import { ListingsView, describeFilters } from "@/components/listings/ListingsView";
import { SellFab } from "@/components/SellFab";

/**
 * Indexing rules (docs/seo.md):
 * - exactly one category or district filter → canonical is that landing page;
 * - unfiltered list → self-canonical, pages 2+ keep their own URL;
 * - sorted views, text search and multi-filter combinations → noindex,follow (thin, combinatorial).
 */
function seoFor(f: ReturnType<typeof parseFilters>) {
  const set = Object.entries(f).filter(([k, v]) => v !== undefined && k !== "sort" && k !== "page");
  const sorted = !!f.sort && f.sort !== "newest";
  if (set.length === 1 && f.category) return { path: `/category/${f.category}`, noindex: sorted || (f.page ?? 1) > 1 };
  if (set.length === 1 && f.district) return { path: `/district/${f.district}`, noindex: sorted || (f.page ?? 1) > 1 };
  if (set.length === 0) return { path: f.page && f.page > 1 ? `/ads?page=${f.page}` : "/ads", noindex: sorted };
  return { path: "/ads", noindex: true };
}

export async function generateMetadata(props: PageProps<"/ads">): Promise<Metadata> {
  const f = parseFilters(await props.searchParams);
  const { total, page, pages } = searchAds(f);
  const what = describeFilters(f);
  const pageLabel = pages > 1 && page > 1 ? ` · পাতা ${bn(page)}` : "";
  const { path, noindex } = seoFor(f);
  return pageMeta({
    title: f.q ? `“${f.q}” খোঁজার ফল` : `${what} বিক্রির বিজ্ঞাপন (${bn(total)}টি)${pageLabel}`,
    description: `${what}: ${bn(total)}টি চালু বিজ্ঞাপন${pageLabel}। সংখ্যা, গড় ওজন, বয়স, দর ও এলাকা দেখে খামার থেকে সরাসরি কিনুন, খামারির সাথে কল বা হোয়াটসঅ্যাপে কথা বলুন।`,
    path,
    noindex: noindex || !!f.q,
  });
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

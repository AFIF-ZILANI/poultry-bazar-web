import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AdFilters, SortKey } from "@/lib/types";
import { filtersToQuery, getCategory, getDistrict, getDivision, searchAds } from "@/lib/api";
import { bn, kg } from "@/lib/format";
import { ListingCard } from "../ListingCard";
import { FilterForm } from "./FilterForm";
import { FilterSheetButton } from "./FilterSheetButton";
import { SaveSearchButton } from "./SaveSearchButton";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "নতুন আগে" },
  { key: "price_asc", label: "দর কম আগে" },
  { key: "weight_desc", label: "ওজন বেশি আগে" },
  { key: "count_desc", label: "বেশি মুরগী আগে" },
];

export function describeFilters(f: AdFilters): string {
  const parts: string[] = [];
  parts.push(f.category ? getCategory(f.category)!.name : "মুরগী");
  if (f.district) parts.push(getDistrict(f.district)!.name);
  else if (f.division) parts.push(`${getDivision(f.division)!.name} বিভাগ`);
  return parts.join(", ");
}

function chips(f: AdFilters) {
  const out: { label: string; remove: Partial<AdFilters> }[] = [];
  if (f.q) out.push({ label: `“${f.q}”`, remove: { q: undefined } });
  if (f.category) out.push({ label: getCategory(f.category)!.name, remove: { category: undefined } });
  if (f.division) out.push({ label: `${getDivision(f.division)!.name} বিভাগ`, remove: { division: undefined } });
  if (f.district) out.push({ label: getDistrict(f.district)!.name, remove: { district: undefined } });
  if (f.minWeight || f.maxWeight)
    out.push({
      label: `ওজন ${f.minWeight ? kg(f.minWeight) : "০"} – ${f.maxWeight ? kg(f.maxWeight) : "যেকোনো"}`,
      remove: { minWeight: undefined, maxWeight: undefined },
    });
  if (f.minAge || f.maxAge) out.push({ label: `বয়স ${f.minAge ? bn(f.minAge) : "০"}–${f.maxAge ? bn(f.maxAge) : "…"} দিন`, remove: { minAge: undefined, maxAge: undefined } });
  if (f.maxPrice) out.push({ label: `দর ≤ ৳${bn(f.maxPrice)}`, remove: { maxPrice: undefined } });
  if (f.health) out.push({ label: "শুধু সুস্থ", remove: { health: undefined } });
  return out;
}

export function ListingsView({ f, heading, intro }: { f: AdFilters; heading: string; intro?: React.ReactNode }) {
  const res = searchAds(f);
  const active = chips(f);
  const query = filtersToQuery({ ...f, page: undefined, sort: undefined });

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <div className="max-w-3xl">
        <h1 className="text-[28px] font-extrabold text-brand-900 sm:text-[34px]">{heading}</h1>
        {intro}
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside aria-label="ফিল্টার" className="hidden lg:block">
          <div className="sticky top-24 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <FilterForm f={f} idPrefix="side" />
          </div>
        </aside>

        <section aria-labelledby="results-title">
          <div className="flex flex-wrap items-center gap-2">
            <FilterSheetButton active={active.length}>
              <FilterForm f={f} idPrefix="sheet" />
            </FilterSheetButton>
            <SaveSearchButton filters={f} query={query} label={describeFilters(f)} />
            <p id="results-title" className="ml-auto text-[15px] text-muted" aria-live="polite">
              <span className="num font-bold text-ink">{bn(res.total)}</span>টি বিজ্ঞাপন
            </p>
          </div>

          {active.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="চালু ফিল্টার">
              {active.map((c) => (
                <li key={c.label}>
                  <Link
                    href={`/ads${filtersToQuery(f, { ...c.remove, page: undefined })}`}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-100 py-1 pl-3 pr-2 text-[14px] font-medium text-brand-900 hover:bg-brand-200"
                  >
                    {c.label} <X className="size-3.5" aria-label="সরান" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <nav aria-label="সাজানো" className="no-scrollbar -mx-4 mt-4 flex gap-1 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
            {SORTS.map((s) => {
              const current = (f.sort ?? "newest") === s.key;
              return (
                <Link
                  key={s.key}
                  href={`/ads${filtersToQuery(f, { sort: s.key, page: undefined })}`}
                  aria-current={current ? "true" : undefined}
                  className={`shrink-0 border-b-2 px-3 py-2.5 text-[15px] font-medium ${current ? "border-brand-700 text-brand-900" : "border-transparent text-muted hover:text-ink"}`}
                >
                  {s.label}
                </Link>
              );
            })}
          </nav>

          {res.items.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {res.items.map((ad) => (
                <ListingCard key={ad.code} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-8 text-center">
              <h2 className="text-[20px] font-bold">এই খোঁজে এখন কোনো বিজ্ঞাপন নেই</h2>
              <p className="mx-auto mt-2 max-w-[44ch] text-[15px] text-muted">
                কিছু ফিল্টার সরিয়ে দেখুন, অথবা “নতুন বিজ্ঞাপনে জানান” চাপুন। মিল পাওয়া গেলেই SMS পাবেন।
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/ads" className="rounded-full border border-line-strong px-4 py-2 text-[15px] font-semibold">
                  সব বিজ্ঞাপন
                </Link>
                <Link href="/wanted/new" className="rounded-full bg-brand-700 px-4 py-2 text-[15px] font-semibold text-white">
                  চাহিদা পোস্ট করুন
                </Link>
              </div>
            </div>
          )}

          {res.pages > 1 && (
            <nav aria-label="পাতা" className="mt-8 flex items-center justify-center gap-2">
              {res.page > 1 ? (
                <Link href={`/ads${filtersToQuery(f, { page: res.page - 1 })}`} rel="prev" className="inline-flex h-11 items-center gap-1 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-semibold">
                  <ChevronLeft className="size-4" aria-hidden /> আগের
                </Link>
              ) : null}
              <span className="px-3 text-[15px] text-muted">
                পাতা <span className="num text-ink">{bn(res.page)}</span> / <span className="num">{bn(res.pages)}</span>
              </span>
              {res.page < res.pages ? (
                <Link href={`/ads${filtersToQuery(f, { page: res.page + 1 })}`} rel="next" className="inline-flex h-11 items-center gap-1 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-semibold">
                  পরের <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

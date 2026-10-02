// Data access. Pages import from here only (docs/rules.md). Signatures mirror the v1 REST API so the
// mock can be swapped for fetch() calls without touching pages.
import type { Ad, AdFilters, CategorySlug, Health, SortKey } from "./types";
import { categories, categoryBySlug, districtBySlug, districts, divisionBySlug, divisions } from "./data/catalog";
import { ads, rates, sellers, wanted, ME_ID } from "./data/generate";
import { fromBnDigits } from "./format";

export const PAGE_SIZE = 24;

export const getCategories = () => categories;
export const getCategory = (slug: string) => categoryBySlug.get(slug as CategorySlug);
export const getDivisions = () => divisions;
export const getDivision = (slug: string) => divisionBySlug.get(slug);
export const getDistricts = (division?: string) => (division ? districts.filter((d) => d.division === division) : districts);
export const getDistrict = (slug: string) => districtBySlug.get(slug);
export const getSeller = (id: string) => sellers.find((s) => s.id === id);
export const getAd = (code: string) => ads.find((a) => a.code.toLowerCase() === code.toLowerCase());
export const getAllAds = () => ads;
export const getAdsBySeller = (sellerId: string) => ads.filter((a) => a.sellerId === sellerId);
export const getMyAds = () => getAdsBySeller(ME_ID);
export const getRates = () => rates;
export const getRate = (cat: CategorySlug) => rates.find((r) => r.category === cat)!;
export const getWanted = () => [...wanted].sort((a, b) => b.postedAt.localeCompare(a.postedAt));

/** Searchable text for an ad: category, place, code, in Bangla and English. */
function haystack(ad: Ad): string {
  const c = categoryBySlug.get(ad.category)!;
  const d = districtBySlug.get(ad.district)!;
  return [c.name, c.nameEn, d.name, d.nameEn, ad.upazila, ad.village, ad.code, divisionBySlug.get(d.division)!.name]
    .join(" ")
    .toLowerCase();
}

export function searchAds(f: AdFilters) {
  const terms = f.q ? fromBnDigits(f.q).toLowerCase().split(/\s+/).filter(Boolean) : [];
  let list = ads.filter((a) => {
    if (!f.includeClosed && a.status !== "ACTIVE") return false;
    if (f.category && a.category !== f.category) return false;
    if (f.district && a.district !== f.district) return false;
    if (f.division && districtBySlug.get(a.district)!.division !== f.division) return false;
    if (f.health && a.health !== f.health) return false;
    if (f.minWeight && a.avgWeightG < f.minWeight) return false;
    if (f.maxWeight && a.avgWeightG > f.maxWeight) return false;
    if (f.minAge && a.ageDays < f.minAge) return false;
    if (f.maxAge && a.ageDays > f.maxAge) return false;
    if (f.maxPrice && (a.pricePerKg === null || a.pricePerKg > f.maxPrice)) return false;
    if (terms.length) {
      const h = haystack(a);
      if (!terms.every((t) => h.includes(t))) return false;
    }
    return true;
  });

  const sorters: Record<SortKey, (a: Ad, b: Ad) => number> = {
    newest: (a, b) => b.postedAt.localeCompare(a.postedAt),
    price_asc: (a, b) => (a.pricePerKg ?? Infinity) - (b.pricePerKg ?? Infinity),
    weight_desc: (a, b) => b.avgWeightG - a.avgWeightG,
    count_desc: (a, b) => b.birdCount - a.birdCount,
  };
  list = [...list].sort(sorters[f.sort ?? "newest"]);

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page ?? 1), pages);
  return { items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total, page, pages };
}

export function getSimilar(ad: Ad, n = 4) {
  const div = districtBySlug.get(ad.district)!.division;
  return ads
    .filter((a) => a.code !== ad.code && a.status === "ACTIVE" && a.category === ad.category)
    .sort((a, b) => {
      const sa = districtBySlug.get(a.district)!.division === div ? 0 : 1;
      const sb = districtBySlug.get(b.district)!.division === div ? 0 : 1;
      return sa - sb || b.postedAt.localeCompare(a.postedAt);
    })
    .slice(0, n);
}

/** Average sold price in the ad's district for its category, falling back to the national rate. */
export function getReferenceRate(cat: CategorySlug, district: string) {
  const r = getRate(cat);
  const div = districtBySlug.get(district)?.division;
  const local = r.byDivision.find((x) => x.division === div);
  return local?.price ? { price: local.price, scope: divisionBySlug.get(div!)!.name, sales: local.sales } : { price: r.today, scope: "সারা দেশ", sales: r.sales };
}

// ---------- URL <-> filters ----------
const SORTS: SortKey[] = ["newest", "price_asc", "weight_desc", "count_desc"];
type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const num = (v: string | string[] | undefined) => {
  const s = one(v);
  const n = s ? Number(fromBnDigits(s)) : NaN;
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function parseFilters(sp: SP): AdFilters {
  const category = one(sp.category);
  const health = one(sp.health);
  const sort = one(sp.sort);
  return {
    q: one(sp.q)?.slice(0, 80),
    category: category && categoryBySlug.has(category as CategorySlug) ? (category as CategorySlug) : undefined,
    division: one(sp.division) && divisionBySlug.has(one(sp.division)!) ? one(sp.division) : undefined,
    district: one(sp.district) && districtBySlug.has(one(sp.district)!) ? one(sp.district) : undefined,
    health: health === "HEALTHY" || health === "SICK" ? (health as Health) : undefined,
    minWeight: num(sp.minWeight),
    maxWeight: num(sp.maxWeight),
    minAge: num(sp.minAge),
    maxAge: num(sp.maxAge),
    maxPrice: num(sp.maxPrice),
    sort: sort && SORTS.includes(sort as SortKey) ? (sort as SortKey) : undefined,
    page: num(sp.page),
  };
}

export function filtersToQuery(f: AdFilters, patch: Partial<AdFilters> = {}): string {
  const merged = { ...f, ...patch };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v === undefined || v === null || v === "" || k === "includeClosed") continue;
    if (k === "page" && v === 1) continue;
    if (k === "sort" && v === "newest") continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

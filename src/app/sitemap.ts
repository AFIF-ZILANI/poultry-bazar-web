import type { MetadataRoute } from "next";
import { getAllAds, getCategories, getDistricts } from "@/lib/api";
import { MOCK_NOW } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

const THIRTY_DAYS = 30 * 86400000;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = MOCK_NOW;
  const fixed: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/rates`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ads`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/wanted`, lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/app`, changeFrequency: "monthly", priority: 0.6 },
    ...["about", "contact", "safety", "privacy"].map((p) => ({ url: `${SITE_URL}/${p}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
  const cats = getCategories().map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 }));
  const dists = getDistricts().map((d) => ({ url: `${SITE_URL}/district/${d.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.7 }));
  // Active listings, plus closed ones for 30 days (they keep price-history value; docs/seo.md).
  const ads = getAllAds()
    .filter((a) => a.status === "ACTIVE" || now.getTime() - new Date(a.postedAt).getTime() < THIRTY_DAYS)
    .map((a) => ({ url: `${SITE_URL}/ads/${a.code}`, lastModified: new Date(a.postedAt), changeFrequency: "daily" as const, priority: a.status === "ACTIVE" ? 0.6 : 0.3 }));
  return [...fixed, ...cats, ...dists, ...ads];
}

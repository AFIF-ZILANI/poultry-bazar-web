import type { Metadata } from "next";
import { INDEXABLE, SITE_NAME } from "./site";

const DEFAULT_OG = { url: "/opengraph-image", width: 1200, height: 630, alt: "Poultry BAZAR — খামার থেকে সরাসরি মুরগী কেনাবেচা" };

/**
 * Complete per-page metadata. Next merges metadata shallowly, so a page that sets `openGraph`
 * replaces the layout's: this helper always emits the full set (canonical, og:url, site name,
 * locale, twitter card) so nothing goes missing. The OG image comes from opengraph-image files.
 */
export function pageMeta({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
  image,
}: {
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/rates". Resolved against metadataBase. */
  path: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
  /** Share image path; defaults to the site-wide card. Listings pass their own generated card. */
  image?: { url: string; alt: string };
}): Metadata {
  const index = INDEXABLE && !noindex;
  const og = image ? { ...DEFAULT_OG, ...image } : DEFAULT_OG;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    // Set explicitly: an `openGraph` object here would otherwise hide segment opengraph-image files.
    openGraph: { type: "website", url: path, siteName: SITE_NAME, locale: "bn_BD", title, description, images: [og] },
    twitter: { card: "summary_large_image", title, description, images: [og.url] },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
  };
}

/** Metadata for pages that must never be indexed (account, forms, demo tools). */
export function privateMeta(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}

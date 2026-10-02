/**
 * Public origin used for canonicals, sitemap, robots, OG images and JSON-LD.
 * Order: explicit NEXT_PUBLIC_SITE_URL (set this when you move to poultrybazarbd.com) → Vercel's
 * production domain (set automatically on Vercel) → localhost for development.
 * Never hard-code a domain here: on the wrong host every canonical points elsewhere (SEO audit, Oct 2026).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  return "http://localhost:3000";
}
export const SITE_URL = resolveSiteUrl();

/**
 * Whether search engines may index this deployment.
 * - SITE_INDEXABLE=false always blocks indexing (use it while the site shows demo data).
 * - On Vercel, only the production deployment is indexable; previews get noindex.
 * - Elsewhere (local, other hosts) indexing is allowed unless SITE_INDEXABLE=false.
 */
export const INDEXABLE =
  process.env.SITE_INDEXABLE === "false" ? false : process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
export const SITE_NAME = "Poultry BAZAR";
export const SUPPORT_PHONE = "09610000000";
export const SUPPORT_WHATSAPP = "8801700000000";
export const SUPPORT_EMAIL = "poultrybazarbd@gmail.com";

/** Android app. One source of truth for the version and download link (v1 hard-coded it in six places). */
export const APP = {
  version: "0.5.1",
  apkUrl: "https://dl.poultrybazarbd.com/poultry-bazar-v0.5.1.apk",
  playStoreUrl: null as string | null,
  pageUrl: `${SITE_URL}/app`,
};

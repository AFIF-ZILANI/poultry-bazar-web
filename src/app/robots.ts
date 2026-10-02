import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not be crawled at all.
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private and form pages. Sorted/filtered list variants stay crawlable (noindex,follow) so links are discovered.
      disallow: ["/account", "/sell", "/login", "/register", "/forgot-password", "/wanted/new", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

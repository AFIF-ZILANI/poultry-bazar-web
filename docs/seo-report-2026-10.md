# SEO report: poultry-bazar.vercel.app

Date: October 2026 · Scope: every public page (258 HTML pages crawled, 104 sitemap URLs)

## How this was measured

The live URL is blocked from the audit environment's network, so the audit ran against a production
build of the same code with the environment Vercel sets in production
(`VERCEL_ENV=production`, `VERCEL_PROJECT_PRODUCTION_URL=poultry-bazar.vercel.app`).

- `scripts/seo-audit.mjs`: a crawler that reads robots.txt and the sitemap, follows every internal
  link, and checks titles, descriptions, canonicals, Open Graph, h1, lang, JSON-LD and broken links.
- Google Lighthouse 12 (mobile): SEO, performance, accessibility and best-practice scores on five
  representative pages.

Re-run against the live site at any time: `npm run seo:audit -- https://poultry-bazar.vercel.app`.

## Results

| | Before | After |
|---|---|---|
| Crawler issues | **684** (405 critical, 99 high, 48 medium, 132 low) | **0** |
| Lighthouse SEO (5 pages) | 100 | 100 |
| Lighthouse accessibility | 96–100 | 100 on all 5 |
| Lighthouse performance, home (simulated mobile) | 53 | 98 |
| Lighthouse performance, other pages (simulated) | 83–85 | 84–97 |
| LCP with applied throttling (real slowdown) | n/a | 2.0–2.3 s on all 5 pages |
| DOM size, home | 6,415 elements | 807 |
| Total blocking time, home (simulated) | 740 ms | 70 ms |
| Font download | 339 KB in 8 preloaded files | 291 KB, heading font not preloaded |

Lighthouse SEO was already 100 before the fixes, which shows its limits: it checks that tags
exist, not that they point at the right domain. The critical problems below were invisible to it.

## Issues found and fixed

### Critical

1. **Every canonical, sitemap URL, robots sitemap line, share image and JSON-LD URL pointed to
   `poultrybazarbd.com`**, which still serves the old site. Google would treat the Vercel pages as
   duplicates of pages that don't exist, and WhatsApp/Facebook previews would show broken images.
   *Fix:* the site URL comes from the environment (`NEXT_PUBLIC_SITE_URL`, else Vercel's production
   domain, else localhost). `src/lib/site.ts`.
2. **The root layout set `canonical: "/"`, inherited by every page without its own**, so pages
   like `/brand` told Google they were copies of the home page. *Fix:* removed. Every page now
   gets its canonical from `pageMeta()`.

### High

3. **Listings shared the generic site card** instead of their own image once page-level Open Graph
   was set (Next merges metadata shallowly). *Fix:* `pageMeta()` takes an explicit image, and
   listings pass their own `/ads/{code}/opengraph-image`.
4. **Product structured data without a price** on negotiable listings (a Search Console error), and
   price units in an ignored field (`unitText`). *Fix:* Product is only emitted when there is a
   price, with `UnitPriceSpecification` per kilogram. Negotiable and expired listings carry
   breadcrumbs only.
5. **Preview deployments were indexable**, so every Vercel preview URL was a duplicate of the
   site. *Fix:* when `VERCEL_ENV` isn't `production`, robots.txt is `Disallow: /`, the sitemap is
   empty and every page is `noindex`.

### Medium

6. **`og:url`, site name and locale were missing on 130 pages** (shallow metadata merge). *Fix:* one
   `pageMeta()` helper emits the full set on every page (`src/lib/seo.ts`).
7. **Thin pages:** district and category pages with 0 listings (for example Dinajpur) were in the
   sitemap. *Fix:* they're `noindex` and left out of the sitemap until they have listings.
8. **Sorted and multi-filter list views** were indexable duplicates, and page 2 had page 1's
   title. *Fix:* `noindex, follow` for sorted, searched and multi-filter views; numbered titles for
   page 2 onwards.
9. **Expired listings were in the sitemap.** *Fix:* expired listings are `noindex` and left out;
   sold listings stay for 30 days because they carry price history.
10. **Slow mobile rendering:** listing illustrations were drawn inline as SVG, about 6,000 DOM nodes on
    the home page. *Fix:* served as pre-rendered, immutable-cached image files (`/art/...`).
11. **Fonts:** a 153 KB variable font plus three body weights were all preloaded. *Fix:* two
    static weights per face, and the heading font is not preloaded.
12. **Accessibility** (also used by Google's page-experience signals): an in-text link marked by
    colour only, and a heading level skip on category pages. Both fixed.

### Low

13. `robots.txt` had a non-standard `Host:` line. Removed. `/api/` is now disallowed.
14. The retired `SearchAction` (sitelinks search box) was removed, and the Organization logo now
    points to a PNG.
15. One title over 70 characters (district pages) was shortened, and the short privacy description
    was rewritten.

## Before you go live on poultrybazarbd.com

- In Vercel → Project → Settings → Environment Variables, set
  `NEXT_PUBLIC_SITE_URL=https://poultrybazarbd.com` for Production, then redeploy.
- In Google Search Console, add the property and submit `https://poultrybazarbd.com/sitemap.xml`.
- **The current deployment is indexable and shows sample data** (invented listings and phone
  numbers). I'd recommend keeping it out of Google until real listings are live: otherwise demo ads
  get indexed under the Poultry BAZAR name and later compete with the real site. To do that, set
  `SITE_INDEXABLE=false` in Vercel's Production environment variables and redeploy. Remove it on
  launch day.

## What remains

- Real farmer photos will change image weight. Keep uploads resized (the sell wizard already does
  this) and serve them through `next/image`.
- Field data (real users' Core Web Vitals) only exists after launch. Check the Core Web Vitals
  report in Search Console after 28 days of traffic.

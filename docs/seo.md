# Poultry BAZAR — SEO Plan

## Why it matters

v1 had one indexable URL. Every listing lived after a `#`, which search engines ignore, and the
content loaded from an API with JavaScript. For a marketplace, listing and location pages are the
search surface. v2 makes every listing, category, district and the rates board a real,
server-rendered URL.

## Search intent we target

| Intent (Bangla query) | Page |
|---|---|
| আজকের ব্রয়লার মুরগির দাম, মুরগির বাজার দর | `/rates` |
| ব্রয়লার মুরগি বিক্রি, সোনালী মুরগি বিক্রি | `/category/[slug]` |
| গাজীপুর মুরগি বিক্রি, ময়মনসিংহ ব্রয়লার পাইকারি | `/district/[slug]` |
| specific listing shared in Facebook/WhatsApp | `/ads/[code]` |
| poultry bazar bd, পোল্ট্রি বাজার | `/`, `/about` |

The rates page is the strongest long-term asset: "মুরগির দাম আজ" is searched daily, and we have
first-party sold-price data nobody else publishes.

## URL rules

- Lowercase, ASCII slugs: `/category/broiler`, `/district/gazipur`, `/ads/BR-10423`.
- One URL per thing. Filtered listing URLs (`/ads?district=gazipur`) carry
  `canonical` to the matching landing page when exactly one filter is set, otherwise to `/ads`.
- Paginated pages are real links (`?page=2`) and self-canonical.

## Metadata (every page)

- `<title>`: Bangla first, brand last, ≤ 60 characters where possible.
  - Listing: `ব্রয়লার ১,২০০ পিছ · ১.৮ কেজি · গাজীপুর | Poultry BAZAR`
  - Category: `ব্রয়লার মুরগি বিক্রি — আজকের দর ও বিজ্ঞাপন | Poultry BAZAR`
  - Rates: `আজকের মুরগির দাম (২ অক্টোবর) — ব্রয়লার, সোনালী, লেয়ার | Poultry BAZAR`
- `description`: 120–155 characters, includes count/weight/place or the current rate.
- `alternates.canonical` on every page; `metadataBase` = `https://poultrybazarbd.com`.
- Open Graph + Twitter card on every page; generated `opengraph-image` for listings
  (category, count, weight, place, price). WhatsApp and Facebook are the main sharing channels in BD.
- `<html lang="bn">`.

## Structured data (JSON-LD)

| Page | Types |
|---|---|
| Home | `Organization`, `WebSite` with `SearchAction` (`/ads?q={query}`) |
| Listing | `Product` + `Offer` (price, `priceCurrency: BDT`, `availability`, `areaServed`) + `BreadcrumbList` |
| Category / district | `CollectionPage` + `BreadcrumbList` + `ItemList` of listings |
| Rates | `Dataset` (name, temporalCoverage, spatialCoverage, variableMeasured) |

Sold or expired listings: keep the page (it has price history value), set
`availability: SoldOut`, and drop them from the sitemap after 30 days.

## Technical

- `src/app/sitemap.ts`: home, rates, wanted, all categories, all districts, all active listings.
- `src/app/robots.ts`: allow all; disallow `/account`, `/sell`, `/login`, `/register`; link sitemap.
- `manifest.webmanifest`, square icons (generated `icon` and `apple-icon`).
- Fonts via `next/font` (self-hosted, `display: swap`), no layout shift.
- Images via `next/image` with explicit sizes; listing cards lazy-load below the fold.
- Server rendering for every public page; no content that only appears after client fetch.
- Core Web Vitals targets: LCP < 2.5s on 4G mid-range Android, CLS < 0.05, INP < 200ms.

## Content

- Each category and district landing page gets 80–150 words of real, useful copy (typical weights,
  season, nearby markets), not keyword filler.
- The rates page explains how the number is calculated (average of reported sale prices in the last
  24 hours, minimum 3 sales).
- Safety page targets "মুরগি কেনায় প্রতারণা" queries and builds trust.

## Measurement

- Google Search Console (already verified for the domain): submit `sitemap.xml` on launch.
- Track: indexed pages, impressions for "মুরগির দাম" cluster, clicks to listings from search.

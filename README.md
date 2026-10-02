# Poultry BAZAR (v2 prototype)

A rebuild of [poultrybazarbd.com](https://poultrybazarbd.com) in Next.js 16, on mock data. It fixes the
issues found in the 2 Oct 2026 audit (`audit/`) and adds the features the product was missing:
asking prices, a daily rates board, buyer requests, saved-search alerts, crawlable listing URLs and
an app download page.

All listings, prices, sellers and phone numbers are **sample data**. Photos are drawn illustrations
labelled "ডেমো ছবি".

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Demo login: any valid Bangladeshi mobile number (Bangla or Latin digits) and any 8+ character
password. Demo OTP for registration and password reset: `123456`.

## Deploying (Vercel)

No configuration is needed: the site URL comes from Vercel automatically, and preview deployments are
`noindex`. Environment variables you may set:

| Variable | When |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | When serving from a custom domain, e.g. `https://poultrybazarbd.com` |
| `SITE_INDEXABLE=false` | To keep the deployment out of search engines (recommended while it shows demo data) |

Check SEO on any deployment with `npm run seo:audit -- https://poultry-bazar.vercel.app`.

## Docs

| File | What it covers |
|---|---|
| [`docs/prd.md`](docs/prd.md) | Problem, users, goals and metrics, scope, risks, backend handover |
| [`docs/features.md`](docs/features.md) | Every route and what it does, mapped to the audit finding it fixes |
| [`docs/design.md`](docs/design.md) | Logo, colour, type, layout, components, accessibility |
| [`docs/rules.md`](docs/rules.md) | Engineering, content and security rules for this codebase |
| [`docs/seo.md`](docs/seo.md) | URL rules, metadata, structured data, sitemap, target queries |
| [`docs/seo-report-2026-10.md`](docs/seo-report-2026-10.md) | SEO audit of the Vercel deployment: findings, fixes, before/after scores |

## Where things live

```
src/app/            routes (server components; client components only where needed)
src/components/     UI, one component per file
src/lib/api.ts      the only data access layer; swap mock for fetch() here
src/lib/data/       deterministic mock data
src/lib/format.ts   Bangla digits, weights, prices, dates
src/lib/site.ts     site constants, including the app version and APK link
```

## Wiring the real backend

1. Replace the functions in `src/lib/api.ts` with calls to the existing v1 API.
2. Add the new endpoints listed in `docs/prd.md` §7 (`/rates`, `/wanted`, `/me/alerts`, phone reveal).
3. Replace `src/lib/demo-store.ts` (browser-only mock session) with an `HttpOnly` cookie session.
4. Put login and rate limiting on `POST /api/ads/{code}/phone` (see the comment in that route).

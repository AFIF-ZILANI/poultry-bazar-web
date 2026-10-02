# Poultry BAZAR — Product Requirements (v2)

Status: draft for build · Owner: product · Last updated: 2 Oct 2026

## 1. Problem

Bangladeshi poultry farmers sell finished flocks (broiler, sonali, layer, duck) through middlemen
who set the price. The farmer rarely knows today's fair rate, and nearby traders (পাইকার) have no
single place to see which farms are ready to sell this week.

The v1 site (poultrybazarbd.com) proved the idea: farmers will post a flock with count, weight,
age and photos, and buyers will call. The audit of 2 Oct 2026 found that v1 stops there:

- No asking price, so every listing forces a phone call just to learn the price.
- Sold prices are collected but never shown back to the market.
- Only sellers can post; traders can't post demand.
- Listings live at `/#/ads/CODE`, so search engines index none of them.
- Desktop layout shows zero listings above the fold at 1366px.
- Bengali digits are rejected in every number field.
- Security gaps: possible dev-OTP bypass, no OTP rate limit, public phone numbers, tokens in localStorage.

## 2. Goal

Make Poultry BAZAR the place a farmer checks **before** they sell and a trader checks **before** they buy.

Success means:

| Metric | v1 baseline | v2 target (90 days after launch) |
|---|---|---|
| Listings with an asking price | 0% | ≥ 60% |
| Listings marked sold with price | unknown | ≥ 40% of closed listings |
| Repeat visitors per week (rates page) | n/a | ≥ 30% of weekly users |
| Organic search sessions | ~0 (hash routes) | ≥ 25% of sessions |
| Median time to post a listing | unknown | ≤ 3 minutes on a 4G phone |
| Listing → contact rate | unknown | ≥ 15% of detail views |

## 3. Users

**Seller: the farmer (খামারি).** 25–55, Android phone (often low-end), Bangla keyboard, mobile data,
reads Bangla comfortably, little English. Sells a flock every 30–45 days for broiler. Wants a fair
price and to sell before birds overgrow. Fears scams and wasting time on calls from non-serious buyers.

**Buyer: the trader (পাইকার / আড়তদার).** Buys from many farms in one or two districts. Uses a phone
on the road and sometimes a laptop at the আড়ত. Wants to see ready flocks nearby with weight, age
and price at a glance, and wants to post "I need 2,000 broilers by Friday".

**Admin: the operator.** Moderates listings, handles reports, publishes notices. Desktop.

## 4. Scope of this build

This build is a **frontend prototype on mock data** in Next.js. It must look and behave like the
real product so it can be reviewed with farmers and traders and then wired to the existing API.

In scope:

1. Home with search, today's rates, categories, latest listings, buyer requests.
2. Listings with real URL filters (category, district, health, weight, age, price, sort, text).
3. Listing detail at a real URL with gallery, specs, price, seller trust, contact, report, similar listings.
4. Daily rates board built from sold prices, with 14-day trend.
5. Buyer requests (চাহিদা): list and post.
6. Sell wizard: 4 steps, optional price, 1–5 photos, draft autosave, Bengali digits accepted.
7. Login, registration and OTP with resend timer (mock).
8. Account: my listings (active, sold, expired) with mark-sold sheet, repost, delete; saved alerts.
9. SEO landing pages per category and per district; sitemap, robots, Open Graph images, JSON-LD.
10. About, contact, safety tips, privacy.
11. New logo and brand system.

Out of scope for this build: real backend, real SMS, payments, chat, admin panel rewrite, native app.

## 5. Requirements

### Must
- Every listing has a stable, crawlable URL: `/ads/[code]`.
- Works at 360px and is designed (not stretched) at 1280px+.
- All numeric inputs accept Bengali and Latin digits.
- No `alert`, `confirm` or `prompt`; all dialogs are in-page.
- Phone number is hidden until the viewer taps "নম্বর দেখুন" (and, in production, is logged in).
- Keyboard and screen-reader usable: every control is a real `button`, `a`, or form element with a label.
- Page weight for home under 250 KB JS on first load.

### Should
- WhatsApp contact next to call.
- Saved searches ("alerts") that a trader can create from any filtered listings view.
- Repost an expired listing in one tap.

### Could
- Map view of listings.
- Seller ratings after a completed sale.

## 6. Risks

| Risk | Mitigation |
|---|---|
| Farmers don't want to show a price | Price is optional with "দরদাম সাপেক্ষে" (negotiable); show the district rate as an anchor |
| Rates board is wrong with little data | Show sample size and date range; hide a cell with fewer than 3 sales |
| Scrapers harvest phone numbers | Reveal on tap, login required in production, rate-limited server-side |
| Fake listings | Verified badge only after OTP + first sale; report flow on every listing |

## 7. Handover to backend

Mock data lives in `src/lib/data/`. Every read goes through `src/lib/api.ts`, whose function
signatures match the v1 REST API (`/ads`, `/ads/{code}`, `/categories`, `/locations/...`). Swapping
the mock for `fetch` is a one-file change. New endpoints needed: `/rates`, `/wanted`, `/me/alerts`,
`POST /ads/{code}/reveal-phone`.

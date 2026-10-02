# Poultry BAZAR — Features

Each feature lists the route, what it does, and which audit finding it fixes. Status reflects this
prototype build (mock data, no backend).

## Public

### Home `/`
- Search bar: text query + district select, submits to `/ads?q=…&district=…`.
- Today's rates strip: top 4 categories with price per kg and change vs yesterday, links to `/rates`.
- Category tiles linking to `/category/[slug]`.
- Latest listings (8) and latest buyer requests (4).
- "How selling works" in 3 steps, safety note.
- Fixes: zero listings above the fold on desktop; emoji icons; no h1.

### Listings `/ads`
- Filters in the URL: `q, category, division, district, health, minWeight, maxWeight, minAge, maxAge, maxPrice, sort, page`.
- Sorts: newest, price low→high, weight high→low, most birds.
- Desktop sidebar, mobile bottom sheet; active filters shown as removable chips.
- "Save this search" creates an alert (account).
- Pagination with real `?page=` links (crawlable), 24 per page.
- Fixes: fake search box, no weight/age/price filters, filters lost on back.

### Listing detail `/ads/[code]`
- Gallery with swipe (scroll-snap) and thumbnails.
- Facts: category, count, avg weight, total weight, age, health, place, posted, expires.
- Asking price per kg or "দরদাম সাপেক্ষে", with the district's average sold rate as a reference.
- Seller card: name, verified badge, member since, sold count.
- Contact: phone revealed on tap, Call and WhatsApp buttons, copy number.
- Report listing (in-page sheet with reasons).
- Similar listings (same category, same division).
- JSON-LD `Product` + `Offer`, breadcrumbs.
- Fixes: `tel:` useless on desktop, report button placeholder, scrapeable numbers, giant photo on desktop.

### Rates `/rates`
- Table: category × division, today's average sold price per kg, change vs yesterday, number of sales.
- 14-day trend chart per category.
- Cells with fewer than 3 sales are shown as "—" with an explanation.
- Fixes: sold price data collected but never shown.

### Buyer requests `/wanted`, `/wanted/new`
- List of requests: category, quantity, weight range, district, needed by, buyer.
- Post form (requires login in production; mock here).
- Fixes: demand side missing.

### SEO landings `/category/[slug]`, `/district/[slug]`
- Static pages with intro copy, current rate, and listings for that category or district.

### App download `/app`
- Hero with APK download (version from one constant in `src/lib/site.ts`) and a "Google Play coming soon" slot
  that turns into a real store button when `APP.playStoreUrl` is set.
- Drawn phone mockup of the app home screen, built from the same components and data.
- What the app does, 4-step sideload install guide, QR code for desktop visitors, FAQ.
- `MobileApplication` JSON-LD.
- Linked from: home hero, home app band, header (xl), mobile menu, footer.
- Fixes: APK link hard-coded in six places; no explanation of how to install outside Play Store.

### Content `/about`, `/contact`, `/safety`, `/privacy`
- Contact page that v1 referred to but never had.
- Safety tips: never pay advance, inspect before paying, meet at the farm.

## Account (mock auth)

### Login `/login`, Register `/register`
- Phone + password; phone accepts ০১৭… and 01…; redirects back to the page that required login.
- Register sends OTP (mock), OTP screen has 60s resend timer and "change number".
- Demo OTP is shown in a clearly marked demo banner (never in production).

### Sell `/sell`
- Step 1 Flock: category, count, avg weight (g), age (days), live total weight.
- Step 2 Health and price: healthy/sick as real radio buttons; optional price per kg with the
  district rate shown as a hint.
- Step 3 Place and photos: division → district → upazila, village, 1–5 photos with previews.
- Step 4 Review and publish; upload progress; success page with share links.
- Draft autosaves to localStorage.
- Fixes: 5-photo minimum, Bengali digits rejected, unchecked uploads, no progress.

### My listings `/account`
- Tabs: active, sold, expired. Each with counts; no 20-item cap.
- Mark sold: in-page sheet asking price per kg (feeds the rates board).
- Repost an expired listing in one tap.
- Delete with in-page confirmation.

### Alerts `/account/alerts`
- Saved searches with their filters; delete; "notify by SMS" toggle (mock).

## Platform

- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, per-page Open Graph images.
- Custom 404.
- Header with visible navigation on desktop; compact header + menu sheet on mobile.

## Not in this build
Admin panel, real API, real SMS/OTP, payments, chat, ratings.

# Poultry BAZAR — Design System

## Direction

A working market, not a startup landing page. The reference points are a hand-painted আড়ত signboard,
the chalk rate board at a poultry market, and the green of a ধানক্ষেত. Information is dense and
honest: count, weight, age, price, place. Decoration earns its place only when it carries meaning
(a health status, a price trend, a verified seller).

What we avoid on purpose: gradient heroes, glassmorphism, emoji as icons, stock "happy farmer"
photos, centred everything, identical rounded cards with drop shadows on every block.

## Logo

- **Mark**: a hen in profile built from three geometric pieces: a round body, a comb of three
  rounded teeth, and a beak. It sits inside a rounded square of field green. The comb is the only
  orange in the mark, so it reads at 16px as "green tile, orange top".
- **Wordmark**: "Poultry" in medium weight and "BAZAR" in bold caps, set in Anek Bangla, with the
  Bangla "পোল্ট্রি বাজার" as a secondary line where space allows.
- **Files**: `public/brand/logo-mark.svg`, `src/components/brand/Logo.tsx` (inline SVG, inherits colour).
- **Don'ts**: don't stretch it, don't put the mark on orange, don't add a tagline inside the lockup.

## Colour

All colours are CSS variables declared in `src/app/globals.css` and exposed to Tailwind via `@theme`.

| Token | Hex | Use |
|---|---|---|
| `field-900` | `#0F3D24` | Header, footer, primary text on light surfaces for emphasis |
| `field-700` | `#17633A` | Primary buttons, links, active states |
| `field-100` | `#E3EFE6` | Selected chips, soft panels |
| `comb-600` | `#D2461B` | Single primary call to action per screen ("বিক্রি করুন"), price highlights |
| `comb-50` | `#FCEDE6` | Price badge background |
| `grain-400` | `#E8B547` | Rate board accents, "new" markers |
| `ink` | `#18211B` | Body text |
| `muted` | `#5B675F` | Secondary text (≥ 4.5:1 on paper) |
| `paper` | `#F6F5EF` | Page background (warm, slightly green-grey, not cream) |
| `surface` | `#FFFFFF` | Cards, inputs |
| `line` | `#DCDFD6` | Borders, dividers |
| `ok` / `warn` / `bad` | `#17633A` / `#9A6B00` / `#B42318` | Health and status semantics |

Rule: one orange action per view. If two things are orange, one of them is wrong.

## Type

| Role | Family | Notes |
|---|---|---|
| Display (h1–h3, prices, numbers on rate board) | Anek Bangla 600–800 | Narrow, signboard feel, strong Bangla conjuncts |
| Body and UI | Hind Siliguri 400–600 | The most readable Bangla text face on low-end Android |
| Numbers in tables | Anek Bangla with `tabular-nums` | Columns of rates must line up |

Scale (px): 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48. Body 16 on mobile, never below 14 for anything a
farmer must read. Line height 1.6 for Bangla body (taller ascenders and কার marks need room).

Digits: Bangla digits (০-৯) in all user-facing numbers; Latin digits only in ad codes and URLs.

## Layout

- Container: `max-w-[1200px]` with 16px gutter (24px ≥ 768px).
- Breakpoints: 640, 768, 1024, 1280.
- Listings grid: 2 columns < 768, 3 at 768, 4 at 1280. Cards never wider than 300px.
- Desktop listings: filter sidebar (260px) + results. Mobile: filters in a bottom sheet.
- Detail page: gallery left 7/12, facts and contact right 5/12, contact card sticky on desktop.
- On mobile the contact card sits directly under the price on listing detail, so Call / WhatsApp is on the first or second screen. The sell button lives in
  the header on desktop and in a floating button on mobile home and listings only.

## Components

| Component | Notes |
|---|---|
| `ListingCard` | Image 4:3, code chip, posted time, category, three facts on one line (count · avg weight · age), place, price or "দরদাম সাপেক্ষে". Sold cards show the sold price per kg. |
| `RateBoard` | Table, category rows × division columns, today's price, change vs yesterday with arrow + colour + sign (never colour alone). |
| `Sparkline` | 14-day line, end point emphasised, no axis; always paired with the number. |
| `HealthBadge` | Text + icon: সুস্থ (check) / অসুস্থ (alert). Never colour only. |
| `VerifiedBadge` | Shown for sellers with OTP-verified number and ≥ 1 completed sale. |
| `Sheet` | Bottom sheet on mobile, centred dialog ≥ 768px. Traps focus, Esc closes, returns focus. |
| `NumberField` | `inputmode="numeric"`, accepts ০-৯ and 0-9, shows the value back in Bangla digits. |
| `PhoneReveal` | Masked number `০১৭১১-XXXXXX` until tapped. |
| `Stepper` | Sell wizard steps with labels, current step announced via `aria-current="step"`. |

## Imagery

Real listings show the farmer's own photos. In this prototype, photos are drawn illustrations per
category (shed scene, flock silhouette) with a visible "ডেমো ছবি" tag, so nobody mistakes the
prototype for live data.

## Motion

Short (150–200ms) and functional only: sheet slide, card hover lift on pointer devices, skeleton
shimmer. No marquees, no blinking. All motion off under `prefers-reduced-motion`.

## Accessibility

- Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI boundaries.
- Visible focus ring: 2px `field-700` with 2px offset.
- Touch targets ≥ 44×44px.
- Every icon-only button has `aria-label` in Bangla.
- Form labels are bound with `htmlFor`; errors are linked with `aria-describedby`.

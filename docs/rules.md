# Poultry BAZAR — Engineering and Content Rules

These are the rules for anyone (human or agent) changing this codebase.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4.
- Turbopack is the default for `dev` and `build`.
- Read `node_modules/next/dist/docs/` before using a Next.js API you haven't used in this repo.
  In Next 16, `params` and `searchParams` are Promises: always `await` them.
- Icons: `lucide-react` only. No emoji in UI.
- No UI kit. Components live in `src/components/`, one component per file.

## Structure

```
src/app/            routes (server components by default)
src/components/     UI components ("use client" only where interaction needs it)
src/lib/data/       mock data (the only place fake data lives)
src/lib/api.ts      data access; the only module pages import data from
src/lib/format.ts   Bangla digits, weights, money, relative time
docs/               product docs (this folder)
```

## Code

1. Server components by default. Add `"use client"` to the smallest component that needs state.
2. Pages read data through `src/lib/api.ts` only, never from `src/lib/data` directly.
3. All filter state lives in the URL (`searchParams`), not in component state.
4. Every user-facing number goes through `src/lib/format.ts` (`bn()`, `kg()`, `taka()`).
5. Every number input goes through `parseBnNumber()`, which accepts ০-৯ and 0-9.
6. Never use `alert`, `confirm` or `prompt`. Use `<Sheet>`.
7. Never put a secret, token, or OTP in client code or localStorage in production code paths.
   The mock auth in `src/lib/auth-mock.ts` is the only exception and is labelled as such.
8. Never render raw HTML from data (`dangerouslySetInnerHTML`) except JSON-LD built from typed
   objects with `JSON.stringify`.
9. Links are `next/link`; buttons that navigate are links, buttons that act are `<button>`.
10. No `any`. No unused exports. `npm run lint` and `npm run build` must pass before commit.

## Accessibility (blocking)

- Every interactive element is keyboard reachable and has a visible focus state.
- Icon-only buttons have a Bangla `aria-label`.
- Every input has a bound `<label>`.
- Status is never colour-only: pair it with text or an icon.
- Respect `prefers-reduced-motion`.

## Content

- Bangla first. English only for the brand name, codes, and legal text that must be bilingual.
- Bangla digits in all user-facing numbers.
- Plain words a farmer uses: "মুরগী", "পিছ", "কেজি", "খামার", "পাইকার". Avoid English loan words where
  a common Bangla word exists.
- Buttons say what happens: "বিজ্ঞাপন প্রকাশ করুন", not "সাবমিট".
- Errors say what's wrong and how to fix it: "মোবাইল নম্বর ১১ সংখ্যার হতে হবে (০১XXXXXXXXX)".

## Security (when wiring the real API)

- Refresh token in an `HttpOnly; Secure; SameSite=Lax` cookie set by the API; access token in memory.
- Admin on a separate subdomain.
- OTP: rate limit per number and per IP, CAPTCHA on send, 5-attempt lockout, 5-minute expiry,
  and the API never returns the code.
- Phone numbers come from `POST /ads/{code}/reveal-phone`, which requires login and is rate limited.
- Add CSP via `proxy.ts` / headers in `next.config.ts`; frame-ancestors `none`.

## Git

- Small commits with a clear subject. Docs change with the code that changes behaviour.

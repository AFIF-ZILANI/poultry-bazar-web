// Formatting helpers. Every user-facing number goes through here (see docs/rules.md).

/** Reference "now" for the mock dataset, so server and client render identical relative times. */
export const MOCK_NOW = new Date("2026-10-02T09:00:00+06:00");

const BN = "০১২৩৪৫৬৭৮৯";
const intFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const decFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

/** Latin digits → Bangla digits. Keeps separators and other characters. */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN[Number(d)]);
}

/** Bangla digits → Latin digits. */
export function fromBnDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
}

/** Parse a number typed with Bangla or Latin digits. Returns null when empty or invalid. */
export function parseBnNumber(input: string): number | null {
  const s = fromBnDigits(input).replace(/[,\s]/g, "").trim();
  if (!s || !/^\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

/** Integer with Indian grouping in Bangla digits: 12000 → ১২,০০০ */
export function bn(n: number): string {
  return toBnDigits(intFmt.format(n));
}

export function bnDec(n: number): string {
  return toBnDigits(decFmt.format(n));
}

export function kg(grams: number): string {
  return `${bnDec(grams / 1000)} কেজি`;
}

export function totalKg(count: number, avgG: number): number {
  return Math.round((count * avgG) / 1000);
}

export function taka(n: number): string {
  return `৳${bn(n)}`;
}

export function perKg(n: number): string {
  return `৳${bn(n)}/কেজি`;
}

export function days(n: number): string {
  return `${bn(n)} দিন`;
}

/** Age in the unit farmers use: days for broiler/sonali, months for deshi/duck, weeks for spent layers. */
export function age(daysOld: number): string {
  if (daysOld < 100) return `${bn(daysOld)} দিন`;
  if (daysOld < 365) return `${bn(Math.round(daysOld / 30))} মাস`;
  return `${bn(Math.round(daysOld / 7))} সপ্তাহ`;
}

export function relativeTime(iso: string, now: Date = MOCK_NOW): string {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "এইমাত্র";
  if (min < 60) return `${bn(min)} মিনিট আগে`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${bn(hr)} ঘণ্টা আগে`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${bn(d)} দিন আগে`;
  return dateBn(iso);
}

export function timeLeft(iso: string, now: Date = MOCK_NOW): string {
  const diff = new Date(iso).getTime() - now.getTime();
  if (diff <= 0) return "মেয়াদ শেষ";
  const hr = Math.floor(diff / 3600000);
  if (hr < 24) return `${bn(hr)} ঘণ্টা বাকি`;
  return `${bn(Math.floor(hr / 24))} দিন বাকি`;
}

const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

/** Dates are shown in Bangladesh time regardless of server or browser timezone. */
function bdDate(iso: string): Date {
  return new Date(new Date(iso).getTime() + 6 * 3600000);
}

export function dateBn(iso: string): string {
  const d = bdDate(iso);
  return `${toBnDigits(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]}`;
}

export function dateBnYear(iso: string): string {
  const d = bdDate(iso);
  return `${MONTHS[d.getUTCMonth()]} ${toBnDigits(d.getUTCFullYear())}`;
}

/** 01711234567 → ০১৭১১-২৩৪৫৬৭ */
export function phoneBn(phone: string): string {
  return toBnDigits(`${phone.slice(0, 5)}-${phone.slice(5)}`);
}

export function maskedPhoneBn(phone: string): string {
  return `${toBnDigits(phone.slice(0, 5))}-XXXXXX`;
}

/** Accepts ০১৭…, 01…, +8801…, 8801…; returns 01XXXXXXXXX or null. */
export function normalizeBdMobile(input: string): string | null {
  let s = fromBnDigits(input).replace(/[\s-]/g, "");
  if (s.startsWith("+880")) s = "0" + s.slice(4);
  else if (s.startsWith("880")) s = "0" + s.slice(3);
  return /^01[3-9]\d{8}$/.test(s) ? s : null;
}

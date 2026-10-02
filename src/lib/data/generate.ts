// Deterministic mock data. Same output on every build, server and client.
import type { Ad, CategoryRate, CategorySlug, RatePoint, Seller, WantedPost } from "../types";
import { MOCK_NOW } from "../format";
import { categories, districts, divisions } from "./catalog";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20261002);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
const between = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
const hoursAgo = (h: number) => new Date(MOCK_NOW.getTime() - h * 3600000).toISOString();

/** Base farm-gate price per kg (live weight) on MOCK_NOW. */
export const BASE_PRICE: Record<CategorySlug, number> = {
  broiler: 168,
  sonali: 262,
  layer: 232,
  deshi: 480,
  duck: 365,
  quail: 390,
};

const SPEC: Record<CategorySlug, { count: [number, number]; weight: [number, number]; age: [number, number] }> = {
  broiler: { count: [400, 3500], weight: [1500, 2300], age: [27, 36] },
  sonali: { count: [300, 2500], weight: [700, 1150], age: [55, 72] },
  layer: { count: [800, 5000], weight: [1450, 1900], age: [480, 560] },
  deshi: { count: [30, 250], weight: [800, 1500], age: [120, 180] },
  duck: { count: [100, 1500], weight: [1500, 2500], age: [90, 150] },
  quail: { count: [1000, 6000], weight: [150, 200], age: [35, 45] },
};

const FIRST = ["মোঃ রফিকুল", "আব্দুল", "শাহানা", "মোঃ জসিম", "নাসির", "রেহানা", "মোঃ কামরুল", "সুমন", "আলমগীর", "মাহমুদা", "হাবিবুর", "দেলোয়ার", "ফারুক", "রুবিনা", "মোঃ সাইফুল", "তানভীর", "মিজানুর", "শফিক"];
const LAST = ["ইসলাম", "হক", "বেগম", "উদ্দিন", "আহমেদ", "খাতুন", "হাসান", "মিয়া", "সরকার", "আক্তার", "রহমান", "হোসেন", "শেখ", "পারভীন", "ইসলাম", "চৌধুরী", "রহমান", "উল্লাহ"];
const VILLAGES = ["পূর্বপাড়া", "চরপাড়া", "দক্ষিণ বাগ", "নয়াপাড়া", "কালিবাড়ি", "মধ্যপাড়া", "উত্তরপাড়া", "বটতলা", "হাটখোলা", "মসজিদপাড়া"];
const NOTES = [
  "ব্যাচ রেডি, ২-৩ দিনের মধ্যে নিতে হবে। ওজন মেপে দেওয়া হবে।",
  "ভ্যাকসিন সময়মতো দেওয়া। খামারে এসে দেখে নিতে পারেন।",
  "ট্রাক ঢোকার রাস্তা আছে। সকালে লোড করা যাবে।",
  "একসাথে পুরো ব্যাচ বিক্রি হবে, ভাগে নয়।",
  "খাবার: কোম্পানি ফিড। মৃত্যুহার ২% এর কম।",
  "",
];

export const ME_ID = "s-me";

export const sellers: Seller[] = [
  { id: ME_ID, name: "মোঃ সাইদুর রহমান", phone: "01700000000", memberSince: "2025-11-14T00:00:00+06:00", verified: true, soldCount: 3, district: "gazipur" },
  ...FIRST.map((f, i) => ({
    id: `s-${i + 1}`,
    name: `${f} ${LAST[i]}`,
    phone: `01${pick(["7", "8", "9", "3", "5", "6"])}${String(between(10000000, 99999999))}`,
    memberSince: hoursAgo(between(24 * 40, 24 * 400)),
    verified: rnd() > 0.35,
    soldCount: rnd() > 0.3 ? between(1, 38) : 0,
    district: pick(districts).slug,
  })),
];

function makeAd(i: number, sellerId: string, overrides: Partial<Ad> = {}): Ad {
  const cat = overrides.category ?? pick(categories.map((c) => c.slug));
  const spec = SPEC[cat];
  const seller = sellers.find((s) => s.id === sellerId)!;
  const district = rnd() > 0.35 ? districts.find((x) => x.slug === seller.district)! : pick(districts);
  const posted = overrides.postedAt ? 0 : rnd() < 0.5 ? between(1, 30) : between(31, 24 * 9);
  const hasPrice = rnd() < 0.62;
  const price = roundTo(BASE_PRICE[cat] * (0.95 + rnd() * 0.12), cat === "broiler" ? 1 : 5);
  const statusRoll = rnd();
  const status = statusRoll < 0.78 ? "ACTIVE" : statusRoll < 0.9 ? "SOLD" : "EXPIRED";
  const prefix = categories.find((c) => c.slug === cat)!.codePrefix;
  const ad: Ad = {
    code: `${prefix}-${10400 + i}`,
    category: cat,
    birdCount: roundTo(between(...spec.count), cat === "deshi" ? 5 : 50),
    avgWeightG: roundTo(between(...spec.weight), cat === "quail" ? 5 : 50),
    ageDays: between(...spec.age),
    health: rnd() < 0.92 ? "HEALTHY" : "SICK",
    pricePerKg: hasPrice ? price : null,
    status,
    soldPricePerKg: status === "SOLD" ? roundTo(price * (0.97 + rnd() * 0.05), 1) : null,
    district: district.slug,
    upazila: pick(district.upazilas),
    village: pick(VILLAGES),
    sellerId,
    postedAt: hoursAgo(posted),
    expiresAt: hoursAgo(posted - 24 * 10),
    photos: Array.from({ length: between(1, 5) }, () => between(0, 3)),
    note: pick(NOTES),
    ...overrides,
  };
  if (ad.status === "EXPIRED") ad.expiresAt = hoursAgo(between(2, 48));
  return ad;
}

const sellerIds = sellers.filter((s) => s.id !== ME_ID).map((s) => s.id);

export const ads: Ad[] = [
  // The demo user's own listings, so the account page has something in every tab.
  makeAd(0, ME_ID, { category: "broiler", status: "ACTIVE", postedAt: hoursAgo(5), district: "gazipur", upazila: "শ্রীপুর" }),
  makeAd(1, ME_ID, { category: "sonali", status: "ACTIVE", postedAt: hoursAgo(30), district: "gazipur", upazila: "কাপাসিয়া" }),
  makeAd(2, ME_ID, { category: "broiler", status: "SOLD", soldPricePerKg: 171, postedAt: hoursAgo(24 * 12), district: "gazipur", upazila: "শ্রীপুর" }),
  makeAd(3, ME_ID, { category: "broiler", status: "EXPIRED", postedAt: hoursAgo(24 * 14), district: "gazipur", upazila: "শ্রীপুর" }),
  ...Array.from({ length: 68 }, (_, i) => makeAd(i + 4, pick(sellerIds))),
].map((a) => (a.status === "EXPIRED" && a.sellerId === ME_ID ? { ...a, expiresAt: hoursAgo(20) } : a));

// ---------- Rates: 14 days of average sold price per category, per division ----------
function series(cat: CategorySlug): RatePoint[] {
  // Walk backwards from today's price so day-to-day moves go both ways.
  const prices = [BASE_PRICE[cat]];
  for (let i = 1; i < 14; i++) prices.unshift(Math.round(prices[0] * (0.985 + rnd() * 0.03)));
  return prices.map((price, i) => ({
    date: new Date(MOCK_NOW.getTime() - (13 - i) * 86400000).toISOString(),
    price,
    sales: between(cat === "broiler" ? 18 : 3, cat === "broiler" ? 46 : 14),
  }));
}

export const rates: CategoryRate[] = categories.map((c) => {
  const s = series(c.slug);
  const today = s[s.length - 1];
  return {
    category: c.slug,
    today: today.price,
    yesterday: s[s.length - 2].price,
    sales: today.sales,
    series: s,
    byDivision: divisions.map((dv) => {
      const sales = rnd() < 0.25 ? between(0, 2) : between(3, 12);
      return { division: dv.slug, sales, price: sales >= 3 ? roundTo(today.price * (0.95 + rnd() * 0.1), 1) : null };
    }),
  };
});

// ---------- Buyer requests ----------
const BUYERS: [string, string][] = [
  ["মেসার্স হক ট্রেডার্স", "পাইকার"], ["আল-আমিন পোল্ট্রি আড়ত", "আড়তদার"], ["রহিম ব্রাদার্স", "পাইকার"],
  ["নিউ সোনার বাংলা হোটেল", "রেস্তোরাঁ"], ["কাজী মিট সাপ্লাই", "সরবরাহকারী"], ["মামা-ভাগ্নে ট্রেডার্স", "পাইকার"],
  ["ভাই ভাই পোল্ট্রি", "আড়তদার"], ["সিটি ক্যাটারিং", "ক্যাটারিং"],
];

export const wanted: WantedPost[] = Array.from({ length: 14 }, (_, i) => {
  const cat = i < 6 ? "broiler" : pick(categories.map((c) => c.slug));
  const spec = SPEC[cat];
  const [buyerName, buyerType] = pick(BUYERS);
  const minW = roundTo(between(spec.weight[0], (spec.weight[0] + spec.weight[1]) / 2), 50);
  return {
    id: `w-${200 + i}`,
    category: cat,
    quantity: roundTo(between(spec.count[0], spec.count[1]) * 1.5, 100),
    minWeightG: minW,
    maxWeightG: minW + roundTo(between(200, 500), 50),
    district: pick(districts).slug,
    neededBy: new Date(MOCK_NOW.getTime() + between(1, 6) * 86400000).toISOString(),
    offerPerKg: rnd() < 0.5 ? roundTo(BASE_PRICE[cat] * (0.97 + rnd() * 0.05), 1) : null,
    buyerName,
    buyerType,
    postedAt: hoursAgo(between(1, 60)),
  };
});

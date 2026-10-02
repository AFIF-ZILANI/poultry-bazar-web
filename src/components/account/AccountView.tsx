"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, LogOut, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Ad, Category, District } from "@/lib/types";
import { bn, kg, parseBnNumber, perKg, relativeTime, timeLeft, totalKg, MOCK_NOW } from "@/lib/format";
import { signOut, updateDemo, useDemo } from "@/lib/demo-store";
import { Sheet } from "../ui/Sheet";
import { NumberField } from "../ui/fields";

type Tab = "ACTIVE" | "SOLD" | "EXPIRED" | "ALERTS";

export function AccountView({ seeded, categories, districts }: { seeded: Ad[]; categories: Category[]; districts: District[] }) {
  const user = useDemo((s) => s.user);
  const overrides = useDemo((s) => s.overrides);
  const posted = useDemo((s) => s.posted);
  const alerts = useDemo((s) => s.alerts);
  const deleted = useDemo((s) => s.deleted);
  const [tab, setTab] = useState<Tab>("ACTIVE");
  const [soldFor, setSoldFor] = useState<Ad | null>(null);
  const [deleteFor, setDeleteFor] = useState<Ad | null>(null);
  const [price, setPrice] = useState("");
  const [priceErr, setPriceErr] = useState("");

  const ads = useMemo(
    () => [...posted, ...seeded].filter((a) => !deleted.includes(a.code)).map((a) => ({ ...a, ...overrides[a.code] })),
    [posted, seeded, overrides, deleted],
  );
  const by = (s: Ad["status"]) => ads.filter((a) => a.status === s);
  const counts = { ACTIVE: by("ACTIVE").length, SOLD: by("SOLD").length, EXPIRED: by("EXPIRED").length, ALERTS: alerts.length };
  const cat = (slug: string) => categories.find((c) => c.slug === slug)!;
  const dist = (slug: string) => districts.find((d) => d.slug === slug)!;

  function patch(code: string, p: Partial<Ad>) {
    updateDemo((s) => ({ ...s, overrides: { ...s.overrides, [code]: { ...s.overrides[code], ...p } } }));
  }

  const TABS: [Tab, string][] = [
    ["ACTIVE", "চালু"],
    ["SOLD", "বিক্রি হয়েছে"],
    ["EXPIRED", "মেয়াদ শেষ"],
    ["ALERTS", "সেভ করা খোঁজ"],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-field-900">আমার বিজ্ঞাপন</h1>
          <p className="text-[15px] text-muted">
            {user?.name} · <span className="num">{user?.phone}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/sell" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-comb-600 px-5 text-[15px] font-semibold text-white hover:bg-comb-700">
            <Plus className="size-4" aria-hidden /> নতুন বিজ্ঞাপন
          </Link>
          <button type="button" onClick={signOut} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line-strong px-4 text-[15px] font-medium">
            <LogOut className="size-4" aria-hidden /> লগআউট
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="বিজ্ঞাপনের অবস্থা" className="no-scrollbar -mx-4 mt-6 flex overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`shrink-0 border-b-2 px-4 py-3 text-[15px] font-semibold ${tab === k ? "border-field-700 text-field-900" : "border-transparent text-muted hover:text-ink"}`}
          >
            {l} <span className="num ml-1 rounded-full bg-paper px-2 py-0.5 text-[13px]">{bn(counts[k])}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-5">
        {tab === "ALERTS" ? (
          alerts.length ? (
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4">
                  <Bell className="size-5 text-field-700" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <Link href={`/ads${a.query}`} className="text-[16px] font-bold hover:underline">{a.label}</Link>
                    <p className="text-[14px] text-muted">নতুন মিলের বিজ্ঞাপন এলে {a.sms ? "SMS-এ জানানো হবে" : "শুধু এখানে দেখাবে"}</p>
                  </div>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="checkbox"
                      checked={a.sms}
                      onChange={(e) => updateDemo((s) => ({ ...s, alerts: s.alerts.map((x) => (x.id === a.id ? { ...x, sms: e.target.checked } : x)) }))}
                      className="size-4 accent-[var(--color-field-700)]"
                    />
                    SMS
                  </label>
                  <button
                    type="button"
                    onClick={() => updateDemo((s) => ({ ...s, alerts: s.alerts.filter((x) => x.id !== a.id) }))}
                    aria-label={`${a.label} খোঁজ মুছুন`}
                    className="grid size-10 place-items-center rounded-full text-muted hover:bg-bad-50 hover:text-bad"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Empty text="এখনো কোনো খোঁজ সেভ করেননি। বিজ্ঞাপনের তালিকায় ফিল্টার দিয়ে “নতুন বিজ্ঞাপনে জানান” চাপুন।" href="/ads" cta="বিজ্ঞাপন দেখুন" />
          )
        ) : by(tab).length ? (
          <ul className="space-y-3">
            {by(tab).map((a) => (
              <li key={a.code} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:flex sm:items-center sm:gap-5">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="rounded-md bg-field-100 px-2 py-0.5 font-display text-[13px] font-semibold text-field-800">{a.code}</span>
                    <span className="text-[17px] font-bold">{cat(a.category).name}</span>
                    <span className="text-[13px] text-muted">{relativeTime(a.postedAt)}</span>
                  </p>
                  <p className="num mt-1.5 text-[15px]">
                    {bn(a.birdCount)} পিছ · গড় {kg(a.avgWeightG)} · মোট {bn(totalKg(a.birdCount, a.avgWeightG))} কেজি · {a.upazila}, {dist(a.district).name}
                  </p>
                  <p className="mt-1 text-[14px] text-muted">
                    {a.status === "ACTIVE" && <>দর: {a.pricePerKg ? perKg(a.pricePerKg) : "দরদাম সাপেক্ষে"} · মেয়াদ {timeLeft(a.expiresAt)}</>}
                    {a.status === "SOLD" && <>বিক্রি হয়েছে {a.soldPricePerKg ? perKg(a.soldPricePerKg) : ""}</>}
                    {a.status === "EXPIRED" && <>মেয়াদ শেষ হয়েছে। একবার চাপে আবার ১০ দিনের জন্য চালু করুন।</>}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-0 sm:shrink-0">
                  {a.status === "ACTIVE" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSoldFor(a);
                          setPrice(a.pricePerKg ? bn(a.pricePerKg) : "");
                          setPriceErr("");
                        }}
                        className="h-10 rounded-full bg-field-700 px-4 text-[14px] font-semibold text-white hover:bg-field-800"
                      >
                        বিক্রি হয়েছে
                      </button>
                      <button type="button" onClick={() => setDeleteFor(a)} className="h-10 rounded-full border border-line-strong px-4 text-[14px] font-semibold hover:border-bad hover:text-bad">
                        মুছুন
                      </button>
                    </>
                  )}
                  {a.status === "EXPIRED" && (
                    <button
                      type="button"
                      onClick={() => patch(a.code, { status: "ACTIVE", postedAt: MOCK_NOW.toISOString(), expiresAt: new Date(MOCK_NOW.getTime() + 10 * 86400000).toISOString() })}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full bg-field-700 px-4 text-[14px] font-semibold text-white hover:bg-field-800"
                    >
                      <RotateCcw className="size-4" aria-hidden /> আবার চালু করুন
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            text={tab === "ACTIVE" ? "এখন কোনো চালু বিজ্ঞাপন নেই।" : tab === "SOLD" ? "বিক্রি হওয়া কোনো বিজ্ঞাপন নেই।" : "মেয়াদ শেষ হওয়া কোনো বিজ্ঞাপন নেই।"}
            href="/sell"
            cta="বিজ্ঞাপন দিন"
          />
        )}
      </div>

      <Sheet open={!!soldFor} onClose={() => setSoldFor(null)} title="বিক্রি হয়েছে, কত দরে?">
        {soldFor && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const p = parseBnNumber(price);
              if (!p || p < 20 || p > 2000) {
                setPriceErr("কেজিপ্রতি বিক্রয়মূল্য লিখুন, যেমন ১৭০");
                return;
              }
              patch(soldFor.code, { status: "SOLD", soldPricePerKg: p });
              setSoldFor(null);
              setTab("SOLD");
            }}
          >
            <p className="text-[15px] text-muted">
              {soldFor.code} · {cat(soldFor.category).name}, {bn(soldFor.birdCount)} পিছ। আপনার দেওয়া দর নাম ছাড়া “আজকের দর”-এর গড়ে যোগ হবে, এতে অন্য খামারিরা ন্যায্য দাম পান।
            </p>
            <div className="mt-4">
              <NumberField id="sold-price" label="বিক্রয়মূল্য" value={price} onChange={setPrice} suffix="৳/কেজি" error={priceErr} />
            </div>
            <button type="submit" className="mt-5 h-12 w-full rounded-full bg-field-700 text-[16px] font-semibold text-white">
              বিক্রি হয়েছে হিসেবে চিহ্নিত করুন
            </button>
          </form>
        )}
      </Sheet>

      <Sheet open={!!deleteFor} onClose={() => setDeleteFor(null)} title="বিজ্ঞাপন মুছবেন?">
        {deleteFor && (
          <div>
            <p className="text-[16px]">
              {deleteFor.code} আর কেউ দেখতে পাবে না। বিক্রি হয়ে থাকলে মুছে না দিয়ে “বিক্রি হয়েছে” চাপুন, তাতে দরের হিসাব ঠিক থাকে।
            </p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setDeleteFor(null)} className="h-12 flex-1 rounded-full border border-line-strong text-[16px] font-semibold">
                রেখে দিন
              </button>
              <button
                type="button"
                onClick={() => {
                  updateDemo((s) => ({ ...s, deleted: [...s.deleted, deleteFor.code] }));
                  setDeleteFor(null);
                }}
                className="h-12 flex-1 rounded-full bg-bad text-[16px] font-semibold text-white"
              >
                মুছে দিন
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Empty({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-8 text-center">
      <p className="mx-auto max-w-[46ch] text-[16px] text-muted">{text}</p>
      <Link href={href} className="mt-4 inline-block rounded-full bg-field-700 px-5 py-2.5 text-[15px] font-semibold text-white">
        {cta}
      </Link>
    </div>
  );
}

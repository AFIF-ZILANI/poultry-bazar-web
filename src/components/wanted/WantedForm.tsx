"use client";
import Link from "next/link";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import type { CategorySlug, WantedPost } from "@/lib/types";
import type { Category, District } from "@/lib/types";
import { parseBnNumber } from "@/lib/format";
import { updateDemo, useDemo } from "@/lib/demo-store";
import { NumberField, SelectField, TextField } from "../ui/fields";

export function WantedForm({ categories, districts }: { categories: Category[]; districts: District[] }) {
  const user = useDemo((s) => s.user);
  const [v, setV] = useState({ category: "", qty: "", minW: "", maxW: "", district: "", days: "৩", offer: "", buyer: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof v) => (x: string) => setV((p) => ({ ...p, [k]: x }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    const qty = parseBnNumber(v.qty);
    const minW = parseBnNumber(v.minW);
    const maxW = parseBnNumber(v.maxW);
    const dys = parseBnNumber(v.days);
    if (!v.category) err.category = "কোন মুরগী লাগবে নির্বাচন করুন";
    if (!qty || qty < 10) err.qty = "কমপক্ষে ১০ পিছ লিখুন";
    if (!minW) err.minW = "সর্বনিম্ন ওজন গ্রামে লিখুন, যেমন ১৬০০";
    if (minW && maxW && maxW < minW) err.maxW = "সর্বোচ্চ ওজন সর্বনিম্নের চেয়ে বেশি হতে হবে";
    if (!v.district) err.district = "কোন জেলায় লাগবে নির্বাচন করুন";
    if (!dys || dys > 30) err.days = "১ থেকে ৩০ দিনের মধ্যে লিখুন";
    setErrors(err);
    if (Object.keys(err).length) return;
    const post: WantedPost = {
      id: `w-local-${Date.now()}`,
      category: v.category as CategorySlug,
      quantity: qty!,
      minWeightG: minW!,
      maxWeightG: maxW ?? minW! + 300,
      district: v.district,
      neededBy: new Date(Date.now() + dys! * 86400000).toISOString(),
      offerPerKg: parseBnNumber(v.offer),
      buyerName: v.buyer.trim() || user?.name || "ক্রেতা",
      buyerType: "পাইকার",
      postedAt: new Date().toISOString(),
    };
    updateDemo((s) => ({ ...s, wanted: [post, ...s.wanted] }));
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <CircleCheck className="mx-auto size-10 text-brand-700" aria-hidden />
        <h2 className="mt-3 text-[22px] font-bold">চাহিদা পোস্ট হয়েছে</h2>
        <p className="mt-2 text-[15px] text-muted">মিল আছে এমন খামারিরা আপনাকে কল করবেন। নতুন মিলের বিজ্ঞাপন এলে SMS-এ জানাব।</p>
        <Link href="/wanted" className="mt-5 inline-block rounded-full bg-brand-700 px-6 py-3 text-[16px] font-semibold text-white">
          সব চাহিদা দেখুন
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <SelectField id="w-cat" label="কোন মুরগী লাগবে" value={v.category} onChange={set("category")} options={categories.map((c) => ({ value: c.slug, label: c.name }))} error={errors.category} />
      <NumberField id="w-qty" label="কত পিছ" value={v.qty} onChange={set("qty")} placeholder="যেমন ২০০০" suffix="পিছ" error={errors.qty} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField id="w-minw" label="ওজন, কমপক্ষে" value={v.minW} onChange={set("minW")} placeholder="১৬০০" suffix="গ্রাম" error={errors.minW} />
        <NumberField id="w-maxw" label="ওজন, সর্বোচ্চ (ঐচ্ছিক)" value={v.maxW} onChange={set("maxW")} placeholder="২০০০" suffix="গ্রাম" error={errors.maxW} />
      </div>
      <SelectField id="w-dist" label="কোন জেলায়" value={v.district} onChange={set("district")} options={districts.map((d) => ({ value: d.slug, label: d.name }))} error={errors.district} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField id="w-days" label="কত দিনের মধ্যে লাগবে" value={v.days} onChange={set("days")} suffix="দিন" error={errors.days} />
        <NumberField id="w-offer" label="প্রস্তাবিত দর (ঐচ্ছিক)" value={v.offer} onChange={set("offer")} placeholder="১৭০" suffix="৳/কেজি" hint="না দিলে “আলোচনা সাপেক্ষে” দেখাবে" />
      </div>
      <TextField id="w-buyer" label="প্রতিষ্ঠানের নাম (ঐচ্ছিক)" value={v.buyer} onChange={set("buyer")} placeholder="যেমন: হক ট্রেডার্স" />
      <button type="submit" className="h-12 w-full rounded-full bg-brand-700 text-[17px] font-semibold text-white hover:bg-brand-800">
        চাহিদা পোস্ট করুন
      </button>
    </form>
  );
}

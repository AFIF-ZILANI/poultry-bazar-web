"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, CircleAlert, CircleCheck, ImagePlus, MessageCircle, X } from "lucide-react";
import type { Ad, Category, CategoryRate, CategorySlug, District, Division } from "@/lib/types";
import { bn, kg, parseBnNumber, perKg, toBnDigits } from "@/lib/format";
import { updateDemo } from "@/lib/demo-store";
import { NumberField, SelectField, TextField } from "../ui/fields";

const DRAFT_KEY = "pb_sell_draft";
const STEPS = ["ব্যাচ", "স্বাস্থ্য ও দর", "এলাকা ও ছবি", "যাচাই"];
const MAX_PHOTOS = 5;

interface Draft {
  category: string;
  count: string;
  weight: string;
  age: string;
  health: "" | "HEALTHY" | "SICK";
  priceMode: "fixed" | "negotiable";
  price: string;
  division: string;
  district: string;
  upazila: string;
  village: string;
  note: string;
}
const EMPTY: Draft = { category: "", count: "", weight: "", age: "", health: "", priceMode: "fixed", price: "", division: "", district: "", upazila: "", village: "", note: "" };

interface Photo {
  id: string;
  url: string;
  size: number;
}

/** Downscale to max 1600px JPEG in the browser: 5 phone photos go from ~20 MB to ~1.5 MB. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", 0.82));
  } catch {
    return file;
  }
}

export function SellWizard({
  categories,
  divisions,
  districts,
  rates,
}: {
  categories: Category[];
  divisions: Division[];
  districts: District[];
  rates: CategoryRate[];
}) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(EMPTY);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [restored, setRestored] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [published, setPublished] = useState<Ad | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Restore draft once, then autosave on every change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
        setD({ ...EMPTY, ...JSON.parse(raw) });
        setRestored(true);
      }
    } catch {
      /* no draft */
    }
  }, []);
  useEffect(() => {
    try {
      if (JSON.stringify(d) !== JSON.stringify(EMPTY)) localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      /* storage blocked */
    }
  }, [d]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const set = <K extends keyof Draft>(k: K) => (v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const count = parseBnNumber(d.count);
  const weight = parseBnNumber(d.weight);
  const age = parseBnNumber(d.age);
  const total = count && weight ? Math.round((count * weight) / 1000) : null;
  const cat = categories.find((c) => c.slug === d.category);
  const dist = districts.find((x) => x.slug === d.district);

  const refRate = useMemo(() => {
    const r = rates.find((x) => x.category === d.category);
    if (!r) return null;
    const local = r.byDivision.find((x) => x.division === d.division && x.price);
    return local ? { price: local.price!, scope: divisions.find((v) => v.slug === d.division)!.name } : { price: r.today, scope: "সারা দেশ" };
  }, [rates, d.category, d.division, divisions]);

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!d.category) e.category = "মুরগীর ধরন নির্বাচন করুন";
      if (!count || count < 1) e.count = "মুরগীর সংখ্যা লিখুন, যেমন ১২০০";
      else if (count > 100000) e.count = "সংখ্যা ১,০০,০০০ এর কম হতে হবে";
      if (!weight || weight < 50) e.weight = "গড় ওজন গ্রামে লিখুন, যেমন ১৮০০";
      else if (weight > 6000) e.weight = "গড় ওজন গ্রামে লিখুন (কেজিতে নয়)। ১.৮ কেজি = ১৮০০ গ্রাম";
      if (!age || age < 1) e.age = "বয়স দিনে লিখুন, যেমন ৩২";
    }
    if (s === 1) {
      if (!d.health) e.health = "মুরগী সুস্থ নাকি অসুস্থ জানান";
      if (d.priceMode === "fixed") {
        const p = parseBnNumber(d.price);
        if (!p) e.price = "কেজিপ্রতি দর লিখুন, অথবা “দরদাম সাপেক্ষে” বেছে নিন";
        else if (refRate && (p < refRate.price * 0.5 || p > refRate.price * 2)) e.price = `দরটি আজকের গড় (${perKg(refRate.price)}) থেকে অনেক আলাদা। আবার দেখে নিন।`;
      }
    }
    if (s === 2) {
      if (!d.division) e.division = "বিভাগ নির্বাচন করুন";
      if (!d.district) e.district = "জেলা নির্বাচন করুন";
      if (!d.upazila) e.upazila = "উপজেলা নির্বাচন করুন";
      if (!photos.length) e.photos = "কমপক্ষে ১টি ছবি দিন। খামারের ছবি থাকলে ক্রেতা বেশি কল করেন।";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goto(s: number) {
    setStep(s);
    setErrors({});
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      window.scrollTo({ top: 0 });
    });
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    const next: Photo[] = [];
    for (const f of picked) {
      const blob = await shrink(f);
      next.push({ id: `${f.name}-${f.size}-${Math.random()}`, url: URL.createObjectURL(blob), size: blob.size });
    }
    setPhotos((p) => [...p, ...next]);
    setErrors((e) => ({ ...e, photos: "" }));
  }

  function removePhoto(id: string) {
    setPhotos((p) => {
      const x = p.find((q) => q.id === id);
      if (x) URL.revokeObjectURL(x.url);
      return p.filter((q) => q.id !== id);
    });
  }

  function publish() {
    setProgress(0);
    let pct = 0;
    const t = setInterval(() => {
      pct += 12 + Math.random() * 18;
      if (pct >= 100) {
        clearInterval(t);
        setProgress(100);
        const prefix = cat!.codePrefix;
        const now = new Date();
        const ad: Ad = {
          code: `${prefix}-${String(now.getTime()).slice(-5)}`,
          category: d.category as CategorySlug,
          birdCount: count!,
          avgWeightG: weight!,
          ageDays: age!,
          health: d.health as "HEALTHY" | "SICK",
          pricePerKg: d.priceMode === "fixed" ? parseBnNumber(d.price) : null,
          status: "ACTIVE",
          soldPricePerKg: null,
          district: d.district,
          upazila: d.upazila,
          village: d.village.trim() || "—",
          sellerId: "s-me",
          postedAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 10 * 86400000).toISOString(),
          photos: photos.map((_, i) => i % 4),
          note: d.note.trim(),
        };
        updateDemo((s) => ({ ...s, posted: [ad, ...s.posted] }));
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        setPublished(ad);
      } else setProgress(Math.round(pct));
    }, 220);
  }

  if (published) {
    const shareText = encodeURIComponent(`বিক্রি হবে: ${cat!.name} ${bn(published.birdCount)} পিছ, গড় ${kg(published.avgWeightG)}, ${dist!.name}। Poultry BAZAR বিজ্ঞাপন ${published.code}`);
    return (
      <div className="rounded-2xl border border-field-200 bg-surface p-6 text-center sm:p-10">
        <CircleCheck className="mx-auto size-12 text-field-700" aria-hidden />
        <h2 className="mt-3 text-[26px] font-extrabold">বিজ্ঞাপন প্রকাশ হয়েছে</h2>
        <p className="mt-2 text-[16px] text-muted">আপনার বিজ্ঞাপন কোড</p>
        <p className="num mt-1 inline-block rounded-xl bg-field-100 px-5 py-2 text-[28px] font-extrabold tracking-wider text-field-900">{published.code}</p>
        <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-muted">
          ১০ দিন চালু থাকবে। বিক্রি হলে “আমার বিজ্ঞাপন” থেকে “বিক্রি হয়েছে” চাপুন এবং দর জানান। ডেমোতে এই বিজ্ঞাপন শুধু আপনার অ্যাকাউন্টে দেখা যাবে।
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2">
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-field-700 text-[16px] font-semibold text-white"
          >
            <MessageCircle className="size-5" aria-hidden /> হোয়াটসঅ্যাপে শেয়ার করুন
          </a>
          <Link href="/account" className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong text-[16px] font-semibold">
            আমার বিজ্ঞাপন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2" aria-label="ধাপ">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="min-w-0">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-field-700" : "bg-line"}`} />
            <p className={`mt-1.5 truncate text-[13px] ${i === step ? "font-bold text-field-900" : "text-muted"}`}>
              <span className="num">{toBnDigits(i + 1)}.</span> {s}
            </p>
          </li>
        ))}
      </ol>

      {restored && step === 0 && (
        <p className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-grain-100 px-4 py-2.5 text-[14px] text-[#5c4400]">
          আগের অসম্পূর্ণ বিজ্ঞাপন ফিরিয়ে আনা হয়েছে।
          <button
            type="button"
            onClick={() => {
              setD(EMPTY);
              setRestored(false);
              localStorage.removeItem(DRAFT_KEY);
            }}
            className="font-semibold underline"
          >
            নতুন করে শুরু
          </button>
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            if (validate(step)) goto(step + 1);
          } else publish();
        }}
        className="mt-5 rounded-2xl border border-line bg-surface p-5 sm:p-7"
      >
        <h2 ref={headingRef} tabIndex={-1} className="text-[22px] font-bold outline-none">
          {["কোন মুরগী, কতগুলো?", "স্বাস্থ্য ও দর", "কোথায় আছে, ছবি দিন", "সব ঠিক আছে কি না দেখে নিন"][step]}
        </h2>

        {step === 0 && (
          <div className="mt-5 space-y-5">
            <fieldset aria-describedby={errors.category ? "s-cat-err" : undefined}>
              <legend className="mb-2 text-[15px] font-semibold">মুরগীর ধরন</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((c) => (
                  <label
                    key={c.slug}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-[16px] font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-field-700 ${d.category === c.slug ? "border-field-700 bg-field-50 text-field-900" : "border-line-strong"}`}
                  >
                    <input type="radio" name="category" value={c.slug} checked={d.category === c.slug} onChange={() => set("category")(c.slug)} className="sr-only" />
                    <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${d.category === c.slug ? "border-field-700 bg-field-700" : "border-line-strong"}`} aria-hidden>
                      {d.category === c.slug && <Check className="size-3 text-white" strokeWidth={3} />}
                    </span>
                    {c.name}
                  </label>
                ))}
              </div>
              {errors.category && <p id="s-cat-err" className="mt-1.5 text-[14px] font-medium text-bad">{errors.category}</p>}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField id="s-count" label="মুরগীর সংখ্যা" value={d.count} onChange={set("count")} suffix="পিছ" placeholder="১২০০" error={errors.count} />
              <NumberField id="s-weight" label="গড় ওজন" value={d.weight} onChange={set("weight")} suffix="গ্রাম" placeholder="১৮০০" error={errors.weight} hint={cat ? `সাধারণত ${cat.typicalWeight}` : undefined} />
              <NumberField id="s-age" label="বয়স" value={d.age} onChange={set("age")} suffix="দিন" placeholder="৩২" error={errors.age} hint={cat ? `সাধারণত ${cat.typicalAge}` : undefined} />
            </div>
            <p className="rounded-xl bg-paper px-4 py-3 text-[16px]" aria-live="polite">
              মোট ওজন প্রায়: <span className="num font-bold">{total ? `${bn(total)} কেজি` : "—"}</span>
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 space-y-6">
            <fieldset aria-describedby={errors.health ? "s-health-err" : undefined}>
              <legend className="mb-2 text-[15px] font-semibold">ব্যাচের স্বাস্থ্য</legend>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["HEALTHY", "সব সুস্থ", "নিয়মিত ভ্যাকসিন, রোগ নেই", CircleCheck],
                    ["SICK", "কিছু অসুস্থ", "সৎভাবে জানালে বিশ্বাস বাড়ে", CircleAlert],
                  ] as const
                ).map(([v, l, h, Icon]) => (
                  <label
                    key={v}
                    className={`cursor-pointer rounded-xl border p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-field-700 ${d.health === v ? (v === "HEALTHY" ? "border-field-700 bg-field-50" : "border-bad bg-bad-50") : "border-line-strong"}`}
                  >
                    <input type="radio" name="health" value={v} checked={d.health === v} onChange={() => set("health")(v)} className="sr-only" />
                    <Icon className={`size-6 ${v === "HEALTHY" ? "text-ok" : "text-bad"}`} aria-hidden />
                    <span className="mt-2 block text-[17px] font-bold">{l}</span>
                    <span className="block text-[14px] text-muted">{h}</span>
                  </label>
                ))}
              </div>
              {errors.health && <p id="s-health-err" className="mt-1.5 text-[14px] font-medium text-bad">{errors.health}</p>}
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-[15px] font-semibold">দর</legend>
              <div className="inline-flex rounded-full border border-line-strong p-1" role="radiogroup">
                {(
                  [
                    ["fixed", "কেজিপ্রতি দর দিন"],
                    ["negotiable", "দরদাম সাপেক্ষে"],
                  ] as const
                ).map(([v, l]) => (
                  <label key={v} className={`cursor-pointer rounded-full px-4 py-2 text-[15px] font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-field-700 ${d.priceMode === v ? "bg-field-700 text-white" : "text-ink"}`}>
                    <input type="radio" name="priceMode" value={v} checked={d.priceMode === v} onChange={() => set("priceMode")(v)} className="sr-only" />
                    {l}
                  </label>
                ))}
              </div>
              {d.priceMode === "fixed" && (
                <div className="mt-4 max-w-xs">
                  <NumberField
                    id="s-price"
                    label="কেজিপ্রতি দর"
                    value={d.price}
                    onChange={set("price")}
                    suffix="৳/কেজি"
                    error={errors.price}
                    hint={refRate ? <>আজকের গড় দর ({refRate.scope}): <b className="num">{perKg(refRate.price)}</b></> : undefined}
                  />
                </div>
              )}
              <p className="mt-3 text-[14px] text-muted">দর দেওয়া বিজ্ঞাপনে ক্রেতারা বেশি কল করেন, কারণ শুধু দাম জানতে ফোন করতে হয় না।</p>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField
                id="s-div"
                label="বিভাগ"
                value={d.division}
                onChange={(v) => setD((p) => ({ ...p, division: v, district: "", upazila: "" }))}
                options={divisions.map((x) => ({ value: x.slug, label: x.name }))}
                error={errors.division}
              />
              <SelectField
                id="s-dist"
                label="জেলা"
                value={d.district}
                disabled={!d.division}
                placeholder={d.division ? "নির্বাচন করুন" : "আগে বিভাগ"}
                onChange={(v) => setD((p) => ({ ...p, district: v, upazila: "" }))}
                options={districts.filter((x) => x.division === d.division).map((x) => ({ value: x.slug, label: x.name }))}
                error={errors.district}
              />
              <SelectField
                id="s-upa"
                label="উপজেলা"
                value={d.upazila}
                disabled={!dist}
                placeholder={dist ? "নির্বাচন করুন" : "আগে জেলা"}
                onChange={set("upazila")}
                options={(dist?.upazilas ?? []).map((u) => ({ value: u, label: u }))}
                error={errors.upazila}
              />
            </div>
            <TextField id="s-village" label="গ্রাম বা এলাকা (ঐচ্ছিক)" value={d.village} onChange={set("village")} placeholder="যেমন: পূর্বপাড়া" />

            <fieldset aria-describedby={errors.photos ? "s-photo-err" : "s-photo-hint"}>
              <legend className="text-[15px] font-semibold">
                ছবি <span className="num font-normal text-muted">({toBnDigits(photos.length)}/{toBnDigits(MAX_PHOTOS)})</span>
              </legend>
              <p id="s-photo-hint" className="text-[14px] text-muted">
                ১টি হলেই চলবে, ৫টি পর্যন্ত দিতে পারেন। পুরো শেড, কাছ থেকে মুরগী, আর ওজন মাপার ছবি সবচেয়ে কাজের। ছবি আপলোডের আগে ছোট করা হয়।
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {photos.map((p, i) => (
                  <div key={p.id} className="relative size-24 overflow-hidden rounded-xl border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                    <img src={p.url} alt={`ছবি ${toBnDigits(i + 1)}`} className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      aria-label={`ছবি ${toBnDigits(i + 1)} সরান`}
                      className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-ink/70 text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="grid size-24 place-items-center rounded-xl border-2 border-dashed border-line-strong text-muted hover:border-field-700 hover:text-field-700"
                  >
                    <span className="flex flex-col items-center gap-1 text-[13px] font-medium">
                      {photos.length ? <ImagePlus className="size-6" aria-hidden /> : <Camera className="size-6" aria-hidden />}
                      ছবি যোগ
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {errors.photos && <p id="s-photo-err" className="mt-1.5 text-[14px] font-medium text-bad">{errors.photos}</p>}
            </fieldset>
            <div>
              <label htmlFor="s-note" className="mb-1.5 block text-[15px] font-semibold">
                ক্রেতার জন্য কিছু বলবেন? (ঐচ্ছিক)
              </label>
              <textarea
                id="s-note"
                rows={3}
                maxLength={300}
                value={d.note}
                onChange={(e) => set("note")(e.target.value)}
                placeholder="যেমন: ট্রাক ঢোকার রাস্তা আছে, পুরো ব্যাচ একসাথে বিক্রি হবে"
                className="w-full rounded-xl border border-line-strong px-3.5 py-3 text-[16px] outline-none focus:border-field-700 focus:ring-2 focus:ring-field-700/25"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-5">
            <dl className="divide-y divide-line rounded-xl border border-line">
              {(
                [
                  ["ধরন", cat?.name, 0],
                  ["সংখ্যা", count ? `${bn(count)} পিছ` : "", 0],
                  ["গড় ওজন", weight ? kg(weight) : "", 0],
                  ["মোট ওজন (প্রায়)", total ? `${bn(total)} কেজি` : "", 0],
                  ["বয়স", age ? `${bn(age)} দিন` : "", 0],
                  ["স্বাস্থ্য", d.health === "HEALTHY" ? "সব সুস্থ" : "কিছু অসুস্থ", 1],
                  ["দর", d.priceMode === "fixed" ? perKg(parseBnNumber(d.price) ?? 0) : "দরদাম সাপেক্ষে", 1],
                  ["এলাকা", [d.village, d.upazila, dist?.name].filter(Boolean).join(", "), 2],
                  ["ছবি", `${toBnDigits(photos.length)}টি`, 2],
                ] as const
              ).map(([k, v, s]) => (
                <div key={k} className="flex items-center justify-between gap-3 px-4 py-3">
                  <dt className="text-[15px] text-muted">{k}</dt>
                  <dd className="flex items-center gap-3 text-right">
                    <span className="num text-[16px] font-semibold">{v}</span>
                    <button type="button" onClick={() => goto(s)} className="text-[14px] font-semibold text-field-700 hover:underline">
                      বদলান<span className="sr-only">: {k}</span>
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
            {progress !== null && (
              <div className="mt-5" role="status">
                <div className="flex justify-between text-[14px]">
                  <span>ছবি আপলোড হচ্ছে…</span>
                  <span className="num">{toBnDigits(progress)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-field-700 transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <p className="mt-4 text-[14px] text-muted">
              প্রকাশ করলে আপনি নিশ্চিত করছেন তথ্যগুলো সঠিক। ভুল তথ্যের বিজ্ঞাপন রিপোর্ট হলে সরিয়ে দেওয়া হতে পারে।
            </p>
          </div>
        )}

        <div className="mt-7 flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => goto(step - 1)} disabled={progress !== null} className="h-12 rounded-full border border-line-strong px-6 text-[16px] font-semibold disabled:opacity-50">
              পেছনে
            </button>
          )}
          <button
            type="submit"
            disabled={progress !== null}
            className={`h-12 flex-1 rounded-full text-[17px] font-semibold text-white disabled:opacity-60 ${step === 3 ? "bg-comb-600 hover:bg-comb-700" : "bg-field-700 hover:bg-field-800"}`}
          >
            {step === 3 ? (progress !== null ? "প্রকাশ হচ্ছে…" : "বিজ্ঞাপন প্রকাশ করুন") : "পরের ধাপ"}
          </button>
        </div>
        <p className="mt-3 text-center text-[13px] text-muted">আপনার লেখা নিজে থেকেই সেভ হচ্ছে, পরে এসে শেষ করতে পারবেন।</p>
      </form>
    </div>
  );
}

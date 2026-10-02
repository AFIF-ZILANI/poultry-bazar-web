import Link from "next/link";
import type { AdFilters } from "@/lib/types";
import { getCategories, getDistricts, getDivisions } from "@/lib/api";
import { bn } from "@/lib/format";

const field = "h-11 w-full rounded-lg border border-line bg-surface px-3 text-[15px] outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25";
const label = "mb-1.5 block text-[14px] font-semibold";

function plainBn(n?: number) {
  return n ? bn(n).replace(/,/g, "") : "";
}

/** Server-rendered GET form. Text number inputs accept Bangla or Latin digits (parsed in api.parseFilters). */
export function FilterForm({ f, idPrefix }: { f: AdFilters; idPrefix: string }) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <form action="/ads" method="get" className="space-y-5">
      {f.sort && <input type="hidden" name="sort" value={f.sort} />}
      <div>
        <label htmlFor={id("q")} className={label}>
          খুঁজুন
        </label>
        <input id={id("q")} name="q" type="search" defaultValue={f.q} placeholder="ধরন, এলাকা বা কোড" className={field} />
      </div>

      <fieldset>
        <legend className={label}>মুরগীর ধরন</legend>
        <div className="space-y-1">
          <Radio name="category" value="" checked={!f.category} label="সব ধরন" id={id("cat-all")} />
          {getCategories().map((c) => (
            <Radio key={c.slug} name="category" value={c.slug} checked={f.category === c.slug} label={c.name} id={id(`cat-${c.slug}`)} />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={id("division")} className={label}>
          বিভাগ
        </label>
        <select id={id("division")} name="division" defaultValue={f.division ?? ""} className={field}>
          <option value="">সব বিভাগ</option>
          {getDivisions().map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={id("district")} className={label}>
          জেলা
        </label>
        <select id={id("district")} name="district" defaultValue={f.district ?? ""} className={field}>
          <option value="">সব জেলা</option>
          {getDivisions().map((dv) => (
            <optgroup key={dv.slug} label={dv.name}>
              {getDistricts(dv.slug).map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={label}>গড় ওজন (গ্রাম)</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={id("minw")}>সর্বনিম্ন ওজন</label>
          <input id={id("minw")} name="minWeight" inputMode="numeric" placeholder="যেমন ১৫০০" defaultValue={plainBn(f.minWeight)} className={field} />
          <span className="text-muted" aria-hidden>–</span>
          <label className="sr-only" htmlFor={id("maxw")}>সর্বোচ্চ ওজন</label>
          <input id={id("maxw")} name="maxWeight" inputMode="numeric" placeholder="২২০০" defaultValue={plainBn(f.maxWeight)} className={field} />
        </div>
      </fieldset>

      <fieldset>
        <legend className={label}>বয়স (দিন)</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={id("mina")}>সর্বনিম্ন বয়স</label>
          <input id={id("mina")} name="minAge" inputMode="numeric" placeholder="২৮" defaultValue={plainBn(f.minAge)} className={field} />
          <span className="text-muted" aria-hidden>–</span>
          <label className="sr-only" htmlFor={id("maxa")}>সর্বোচ্চ বয়স</label>
          <input id={id("maxa")} name="maxAge" inputMode="numeric" placeholder="৩৫" defaultValue={plainBn(f.maxAge)} className={field} />
        </div>
      </fieldset>

      <div>
        <label htmlFor={id("price")} className={label}>
          সর্বোচ্চ দর (৳/কেজি)
        </label>
        <input id={id("price")} name="maxPrice" inputMode="numeric" placeholder="যেমন ১৭৫" defaultValue={plainBn(f.maxPrice)} className={field} />
        <p className="mt-1 text-[13px] text-muted">দিলে শুধু দর লেখা বিজ্ঞাপন দেখাবে</p>
      </div>

      <fieldset>
        <legend className={label}>স্বাস্থ্য</legend>
        <div className="flex gap-4">
          <Radio name="health" value="" checked={!f.health} label="সব" id={id("h-all")} />
          <Radio name="health" value="HEALTHY" checked={f.health === "HEALTHY"} label="শুধু সুস্থ" id={id("h-ok")} />
        </div>
      </fieldset>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="h-11 flex-1 rounded-full bg-brand-700 text-[15px] font-semibold text-white hover:bg-brand-800">
          ফল দেখুন
        </button>
        <Link href="/ads" className="inline-flex h-11 items-center rounded-full px-4 text-[15px] font-medium text-muted hover:bg-paper hover:text-ink">
          মুছুন
        </Link>
      </div>
    </form>
  );
}

function Radio({ name, value, checked, label, id }: { name: string; value: string; checked: boolean; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 rounded-md py-1 text-[15px]">
      <input id={id} type="radio" name={name} value={value} defaultChecked={checked} className="size-4 accent-[var(--color-brand-700)]" />
      {label}
    </label>
  );
}

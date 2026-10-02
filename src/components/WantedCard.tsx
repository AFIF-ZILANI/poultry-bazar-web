import { CalendarClock, MapPin, Store } from "lucide-react";
import type { WantedPost } from "@/lib/types";
import { getCategory, getDistrict } from "@/lib/api";
import { bn, dateBn, kg, perKg, relativeTime } from "@/lib/format";

export function WantedCard({ w }: { w: WantedPost }) {
  const c = getCategory(w.category)!;
  const d = getDistrict(w.district)!;
  return (
    <article className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-comb-700">কিনতে চাই</p>
          <h3 className="mt-0.5 text-[18px] font-bold">
            {c.name}, <span className="num">{bn(w.quantity)}</span> পিছ
          </h3>
        </div>
        <span className="shrink-0 text-[12px] text-muted">{relativeTime(w.postedAt)}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
        <div>
          <dt className="text-muted">ওজন</dt>
          <dd className="num font-medium">
            {kg(w.minWeightG)} – {kg(w.maxWeightG)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">প্রস্তাবিত দর</dt>
          <dd className="num font-medium">{w.offerPerKg ? perKg(w.offerPerKg) : "আলোচনা সাপেক্ষে"}</dd>
        </div>
      </dl>
      <ul className="mt-3 space-y-1 text-[14px] text-muted">
        <li className="flex items-center gap-1.5">
          <CalendarClock className="size-4" aria-hidden /> দরকার {dateBn(w.neededBy)} এর মধ্যে
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden /> {d.name} বা আশেপাশে
        </li>
        <li className="flex items-center gap-1.5">
          <Store className="size-4" aria-hidden /> {w.buyerName} · {w.buyerType}
        </li>
      </ul>
    </article>
  );
}

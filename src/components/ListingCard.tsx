import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Ad } from "@/lib/types";
import { getCategory, getDistrict } from "@/lib/api";
import { age, bn, kg, perKg, relativeTime, totalKg } from "@/lib/format";
import { FlockArt } from "./FlockArt";
import { HealthBadge } from "./Badges";

export function ListingCard({ ad }: { ad: Ad }) {
  const cat = getCategory(ad.category)!;
  const dist = getDistrict(ad.district)!;
  const sold = ad.status === "SOLD";
  const seed = Number(ad.code.replace(/\D/g, ""));

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-shadow focus-within:ring-2 focus-within:ring-field-700 focus-within:ring-offset-2 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3]">
        <FlockArt category={ad.category} seed={seed} variant={ad.photos[0]} className="h-full w-full" label={false} />
        <span className="absolute left-2 top-2 rounded-md bg-surface/95 px-2 py-0.5 font-display text-[12px] font-semibold tracking-wide text-field-800">
          {ad.code}
        </span>
        {sold && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/75 px-3 py-1.5 text-center text-[13px] font-semibold text-white">
            বিক্রি হয়েছে{ad.soldPricePerKg ? ` · ${perKg(ad.soldPricePerKg)}` : ""}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-bold leading-snug text-ink">
            <Link href={`/ads/${ad.code}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {cat.name}
            </Link>
          </h3>
          <span className="shrink-0 pt-0.5 text-[12px] text-muted">{relativeTime(ad.postedAt)}</span>
        </div>

        <p className="num text-[14px] leading-snug text-ink/85">
          {bn(ad.birdCount)} পিছ <span className="text-line-strong">·</span> {age(ad.ageDays)}
        </p>
        <p className="num text-[13px] leading-snug text-muted">
          গড় {kg(ad.avgWeightG)} <span className="text-line-strong">·</span> মোট {bn(totalKg(ad.birdCount, ad.avgWeightG))} কেজি
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="flex min-w-0 items-center gap-1 text-[13px] text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {ad.upazila}, {dist.name}
            </span>
          </p>
          {ad.health === "SICK" && <HealthBadge health="SICK" />}
        </div>
        <div className="border-t border-line pt-2">
          {ad.pricePerKg ? (
            <p className="num text-[18px] font-bold text-comb-700">
              {perKg(ad.pricePerKg)}
            </p>
          ) : (
            <p className="text-[14px] font-medium text-muted">দরদাম সাপেক্ষে</p>
          )}
        </div>
      </div>
    </article>
  );
}

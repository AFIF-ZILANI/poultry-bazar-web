import { ImageResponse } from "next/og";
import { getAd, getAllAds, getCategory, getDistrict } from "@/lib/api";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Poultry BAZAR listing";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllAds().map((a) => ({ code: a.code }));
}

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ad = getAd(code);
  if (!ad) return new ImageResponse(<OgFrame eyebrow="LISTING" title="Not found" lines={[]} />, size);
  const c = getCategory(ad.category)!;
  const d = getDistrict(ad.district)!;
  const status = ad.status === "SOLD" ? "SOLD · " : "";
  return new ImageResponse(
    (
      <OgFrame
        eyebrow={`${status}${ad.code} · ${d.nameEn.toUpperCase()}`}
        title={`${c.nameEn}, ${ad.birdCount.toLocaleString("en-IN")} birds`}
        lines={[`Avg ${(ad.avgWeightG / 1000).toFixed(2)} kg · ${ad.ageDays} days old`, `${ad.health === "HEALTHY" ? "Healthy" : "Sick reported"} · direct from farm`]}
        price={ad.pricePerKg ? `Tk ${ad.pricePerKg}/kg` : "Negotiable"}
      />
    ),
    size,
  );
}

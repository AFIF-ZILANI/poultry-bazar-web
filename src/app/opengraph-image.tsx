import { ImageResponse } from "next/og";
import { getRates } from "@/lib/api";
import { OG_SIZE, OgFrame } from "@/lib/og";

export const alt = "Poultry BAZAR — buy and sell poultry direct from the farm";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const broiler = getRates().find((r) => r.category === "broiler")!;
  return new ImageResponse(
    (
      <OgFrame
        eyebrow="BANGLADESH POULTRY MARKETPLACE"
        title="Direct from the farm"
        lines={["Broiler, Sonali, Layer, Deshi, Duck", "Daily farm-gate rates · Buyer requests"]}
        price={`Broiler Tk ${broiler.today}/kg`}
      />
    ),
    size,
  );
}

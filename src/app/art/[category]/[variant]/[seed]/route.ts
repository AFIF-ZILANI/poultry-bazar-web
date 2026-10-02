import type { NextRequest } from "next/server";
import type { CategorySlug } from "@/lib/types";
import { getCategories } from "@/lib/api";
import { ART_SEEDS, ART_VARIANTS, flockArtSvg } from "@/lib/flock-art";

// Prerendered at build: 6 categories × 4 scenes × 12 seeds, served as immutable static files.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().flatMap((c) =>
    Array.from({ length: ART_VARIANTS }, (_, v) => Array.from({ length: ART_SEEDS }, (_, s) => ({ category: c.slug, variant: String(v), seed: String(s) }))).flat(),
  );
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/art/[category]/[variant]/[seed]">) {
  const { category, variant, seed } = await ctx.params;
  return new Response(flockArtSvg(category as CategorySlug, Number(variant), Number(seed)), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}

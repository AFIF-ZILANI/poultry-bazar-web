import type { NextRequest } from "next/server";
import { getAd, getSeller } from "@/lib/api";

/**
 * Reveals a seller's number on request, so numbers are never embedded in page HTML (audit finding:
 * phone harvesting). PRODUCTION: require a session cookie, rate limit per user and IP, and log reveals.
 * The prototype's demo login lives in the browser, so this mock cannot check it.
 */
export async function POST(_req: NextRequest, ctx: RouteContext<"/api/ads/[code]/phone">) {
  const { code } = await ctx.params;
  const ad = getAd(code);
  if (!ad || ad.status !== "ACTIVE") return Response.json({ error: "not_available" }, { status: 404 });
  const seller = getSeller(ad.sellerId)!;
  return Response.json({ phone: seller.phone }, { headers: { "Cache-Control": "no-store" } });
}

import { Bell, Home, MapPin, Plus, Search, User } from "lucide-react";
import { getCategory, getRates, searchAds } from "@/lib/api";
import { bn, kg, perKg } from "@/lib/format";
import { LogoMark } from "../brand/Logo";
import { FlockArt } from "../FlockArt";

/** A drawn Android phone showing the app's home screen, built from the same components and data. */
export function PhoneMockup({ className = "" }: { className?: string }) {
  const rates = getRates().slice(0, 3);
  const ads = searchAds({}).items.slice(0, 4);
  return (
    <div className={`relative mx-auto w-[280px] ${className}`} aria-hidden>
      <div className="rounded-[44px] bg-[#15171D] p-[10px] shadow-[0_30px_60px_-20px_rgb(14_20_51/0.55)]">
        <div className="relative overflow-hidden rounded-[34px] bg-paper">
          {/* status bar */}
          <div className="flex items-center justify-between bg-brand-900 px-5 pb-1 pt-2.5 text-[10px] font-semibold text-white">
            <span className="num">৯:৪১</span>
            <span className="mx-auto h-4 w-16 rounded-full bg-black/80" />
            <span className="num">৪G ▮▮▮</span>
          </div>
          {/* app bar */}
          <div className="flex items-center gap-2 bg-brand-900 px-4 pb-3 pt-1">
            <LogoMark className="size-7" />
            <span className="font-display text-[15px] text-white">
              Poultry <b>BAZAR</b>
            </span>
            <Bell className="ml-auto size-4 text-brand-200" />
          </div>
          <div className="space-y-2.5 px-3 pb-16 pt-3">
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[11px] text-muted ring-1 ring-line">
              <Search className="size-3.5" /> ব্রয়লার, সোনালী, এলাকা…
            </div>
            <div className="rounded-xl bg-brand-800 p-3 text-white">
              <p className="text-[11px] font-semibold text-brand-200">আজকের দর</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                {rates.map((r) => (
                  <div key={r.category}>
                    <p className="text-[10px] text-brand-200">{getCategory(r.category)!.name.split(" ")[0]}</p>
                    <p className="num text-[15px] font-bold text-yolk-400">৳{bn(r.today)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ads.map((a, i) => (
                <div key={a.code} className="overflow-hidden rounded-lg bg-surface ring-1 ring-line">
                  <FlockArt category={a.category} seed={i * 11 + 4} variant={a.photos[0]} className="aspect-[4/3] w-full" label={false} />
                  <div className="p-1.5">
                    <p className="text-[11px] font-bold">{getCategory(a.category)!.name}</p>
                    <p className="num text-[9.5px] text-muted">
                      {bn(a.birdCount)} পিছ · {kg(a.avgWeightG)}
                    </p>
                    <p className="flex items-center gap-0.5 text-[9.5px] text-muted">
                      <MapPin className="size-2.5" />
                      {a.upazila}
                    </p>
                    <p className="num mt-0.5 text-[11px] font-bold text-comb-700">{a.pricePerKg ? perKg(a.pricePerKg) : "দরদাম"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* bottom nav */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-line bg-surface px-4 py-2 text-muted">
            <Home className="size-4 text-brand-700" />
            <Search className="size-4" />
            <span className="grid size-9 -translate-y-3 place-items-center rounded-full bg-comb-600 text-white shadow-md">
              <Plus className="size-5" />
            </span>
            <Bell className="size-4" />
            <User className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Download } from "lucide-react";
import { APP } from "@/lib/site";
import { toBnDigits } from "@/lib/format";

/** Google Play glyph (simplified triangle) so the store button reads at a glance. */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path d="M4 2.5 L14.5 12 L4 21.5 Z" fill="#34A853" />
      <path d="M4 2.5 L17.8 9.9 L14.5 12 Z" fill="#4285F4" />
      <path d="M4 21.5 L17.8 14.1 L14.5 12 Z" fill="#EA4335" />
      <path d="M17.8 9.9 L21 11.6 Q21.6 12 21 12.4 L17.8 14.1 L14.5 12 Z" fill="#FBBC04" />
    </svg>
  );
}

export function AppButtons({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={APP.apkUrl}
        className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 ${dark ? "bg-yolk-400 text-brand-950 hover:bg-yolk-500" : "bg-brand-700 text-white hover:bg-brand-800"}`}
      >
        <Download className="size-6 shrink-0" aria-hidden />
        <span className="flex flex-col leading-tight">
          <span className="text-[17px] font-bold">Android অ্যাপ ডাউনলোড</span>
          <span className={`text-[13px] ${dark ? "text-brand-900" : "text-brand-100"}`}>APK · সংস্করণ {toBnDigits(APP.version)} · বিনামূল্যে</span>
        </span>
      </a>
      {APP.playStoreUrl ? (
        <a href={APP.playStoreUrl} className="inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white">
          <PlayGlyph />
          <span className="flex flex-col leading-tight">
            <span className="text-[12px]">পাওয়া যাচ্ছে</span>
            <span className="text-[17px] font-bold">Google Play</span>
          </span>
        </a>
      ) : (
        <span
          className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 ${dark ? "border-white/25 text-brand-100" : "border-line-strong text-muted"}`}
        >
          <PlayGlyph />
          <span className="flex flex-col leading-tight">
            <span className="text-[12px]">শীঘ্রই আসছে</span>
            <span className="text-[17px] font-bold">Google Play</span>
          </span>
        </span>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { Copy, Eye, Flag, LockKeyhole, MessageCircle, Phone } from "lucide-react";
import { maskedPhoneBn, phoneBn } from "@/lib/format";
import { updateDemo, useDemo } from "@/lib/demo-store";
import { Sheet } from "../ui/Sheet";

const REASONS = [
  ["FAKE", "ভুয়া বা প্রতারণামূলক মনে হচ্ছে"],
  ["ALREADY_SOLD", "আগেই বিক্রি হয়ে গেছে"],
  ["WRONG_INFO", "ওজন, সংখ্যা বা দর ভুল"],
  ["ADVANCE", "অগ্রিম টাকা চাইছে"],
  ["OTHER", "অন্য কারণ"],
] as const;

/**
 * Number is masked until a signed-in viewer asks for it (docs/prd.md). The page only carries the
 * first five digits; the full number comes from POST /api/ads/{code}/phone, which in production
 * requires login and is rate limited.
 */
export function ContactPanel({ code, phonePrefix, sellerName, sold }: { code: string; phonePrefix: string; sellerName: string; sold: boolean }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const reported = useDemo((s) => s.reported.includes(code));
  const user = useDemo((s) => s.user);
  const waText = encodeURIComponent(`আসসালামু আলাইকুম, Poultry BAZAR-এ আপনার বিজ্ঞাপন ${code} দেখেছি। ব্যাচটি কি এখনো আছে?`);

  async function reveal() {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(`/api/ads/${encodeURIComponent(code)}/phone`, { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      setPhone(((await res.json()) as { phone: string }).phone);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  if (sold) {
    return <p className="rounded-xl bg-paper p-4 text-[15px] text-muted">এই ব্যাচ বিক্রি হয়ে গেছে, তাই যোগাযোগের নম্বর আর দেখানো হচ্ছে না।</p>;
  }

  const masked = maskedPhoneBn(phonePrefix);

  return (
    <div>
      {!user ? (
        <div className="rounded-xl border border-line-strong bg-paper px-4 py-3">
          <span className="block text-[13px] text-muted">{sellerName}-এর নম্বর</span>
          <span className="num text-[20px] font-bold tracking-wide">{masked}</span>
          <Link
            href={`/login?next=${encodeURIComponent(`/ads/${code}`)}`}
            className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-700 text-[16px] font-semibold text-white hover:bg-brand-800"
          >
            <LockKeyhole className="size-4" aria-hidden /> লগইন করে নম্বর দেখুন
          </Link>
          <p className="mt-2 text-[13px] text-muted">বিক্রেতার নম্বর যেন কেউ একসাথে সংগ্রহ করতে না পারে, তাই লগইন লাগে।</p>
        </div>
      ) : !phone ? (
        <div>
          <button
            type="button"
            onClick={reveal}
            disabled={loading}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-line-strong bg-paper px-4 py-3 text-left hover:border-brand-700 disabled:opacity-70"
          >
            <span>
              <span className="block text-[13px] text-muted">{sellerName}-এর নম্বর</span>
              <span className="num text-[20px] font-bold tracking-wide">{masked}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-700">
              <Eye className="size-4" aria-hidden /> {loading ? "আনা হচ্ছে…" : "নম্বর দেখুন"}
            </span>
          </button>
          {failed && (
            <p role="alert" className="mt-2 text-[14px] font-medium text-bad">
              নম্বর আনা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চাপুন।
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
            <span>
              <span className="block text-[13px] text-muted">{sellerName}-এর নম্বর</span>
              <span className="num select-all text-[20px] font-bold tracking-wide" aria-live="polite">
                {phoneBn(phone)}
              </span>
            </span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(phone);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-brand-700 hover:bg-brand-100"
            >
              <Copy className="size-4" aria-hidden /> {copied ? "কপি হয়েছে" : "কপি"}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={`tel:${phone}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-700 text-[16px] font-semibold text-white hover:bg-brand-800">
              <Phone className="size-5" aria-hidden /> কল করুন
            </a>
            <a
              href={`https://wa.me/880${phone.slice(1)}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-700 text-[16px] font-semibold text-brand-800 hover:bg-brand-50"
            >
              <MessageCircle className="size-5" aria-hidden /> হোয়াটসঅ্যাপ
            </a>
          </div>
          <p className="mt-2 text-[13px] text-muted">কম্পিউটার থেকে? নম্বর কপি করুন বা হোয়াটসঅ্যাপ ওয়েব ব্যবহার করুন।</p>
        </>
      )}

      <button
        type="button"
        onClick={() => setReportOpen(true)}
        disabled={reported}
        className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-muted hover:text-bad disabled:hover:text-muted"
      >
        <Flag className="size-4" aria-hidden /> {reported ? "রিপোর্ট পাঠানো হয়েছে, ধন্যবাদ" : "এই বিজ্ঞাপনে সমস্যা? রিপোর্ট করুন"}
      </button>

      <Sheet open={reportOpen} onClose={() => setReportOpen(false)} title={`বিজ্ঞাপন ${code} রিপোর্ট করুন`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason) return;
            updateDemo((s) => ({ ...s, reported: [...s.reported, code] }));
            setReportOpen(false);
          }}
        >
          <fieldset>
            <legend className="text-[15px] text-muted">কী সমস্যা? আমাদের টিম ২৪ ঘণ্টার মধ্যে দেখবে।</legend>
            <div className="mt-3 space-y-2">
              {REASONS.map(([v, l]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[16px] ${reason === v ? "border-brand-700 bg-brand-50" : "border-line"}`}>
                  <input type="radio" name="reason" value={v} checked={reason === v} onChange={() => setReason(v)} className="size-4 accent-[var(--color-brand-700)]" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          <label htmlFor="report-note" className="mt-4 block text-[14px] font-semibold">
            আরও কিছু বলতে চাইলে (ঐচ্ছিক)
          </label>
          <textarea id="report-note" rows={3} maxLength={500} className="mt-1.5 w-full rounded-xl border border-line px-3 py-2 text-[15px] outline-none focus:border-brand-700" />
          <button type="submit" disabled={!reason} className="mt-4 h-12 w-full rounded-full bg-brand-700 text-[16px] font-semibold text-white disabled:opacity-50">
            রিপোর্ট পাঠান
          </button>
        </form>
      </Sheet>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { BellPlus, BellRing } from "lucide-react";
import type { AdFilters } from "@/lib/types";
import { updateDemo, useDemo } from "@/lib/demo-store";

/** Saves the current filtered view as an alert ("notify me about new matches"). */
export function SaveSearchButton({ filters, query, label }: { filters: AdFilters; query: string; label: string }) {
  const user = useDemo((s) => s.user);
  const alerts = useDemo((s) => s.alerts);
  const [justSaved, setJustSaved] = useState(false);
  const saved = alerts.some((a) => a.query === query);

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/ads${query}`)}`}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-semibold hover:border-field-700"
      >
        <BellPlus className="size-4" aria-hidden /> নতুন বিজ্ঞাপনে জানান
      </Link>
    );
  }
  return (
    <button
      type="button"
      disabled={saved}
      onClick={() => {
        updateDemo((s) => ({
          ...s,
          alerts: [{ id: `al-${Date.now()}`, label, query, filters, sms: true, createdAt: new Date().toISOString() }, ...s.alerts],
        }));
        setJustSaved(true);
      }}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-semibold enabled:hover:border-field-700 disabled:border-field-200 disabled:bg-field-50 disabled:text-field-800"
    >
      {saved ? <BellRing className="size-4" aria-hidden /> : <BellPlus className="size-4" aria-hidden />}
      {saved ? (justSaved ? "সেভ হয়েছে, SMS-এ জানাব" : "এই খোঁজ সেভ করা আছে") : "নতুন বিজ্ঞাপনে জানান"}
    </button>
  );
}

"use client";
import { useDemo } from "@/lib/demo-store";
import { WantedCard } from "../WantedCard";

/** Requests posted in this browser (demo). Production reads them from the API with the rest. */
export function LocalWanted() {
  const mine = useDemo((s) => s.wanted);
  if (!mine.length) return null;
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {mine.map((w) => (
        <div key={w.id} className="rounded-[calc(var(--radius-card)+3px)] ring-2 ring-yolk-400">
          <WantedCard w={w} />
        </div>
      ))}
    </div>
  );
}

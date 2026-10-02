"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { toBnDigits } from "@/lib/format";
import { FlockArt } from "../FlockArt";

/** Swipeable on touch (scroll-snap), arrow buttons and thumbnails on desktop. Height is capped by aspect ratio. */
export function Gallery({ category, seed, photos, alt }: { category: CategorySlug; seed: number; photos: number[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  function go(n: number) {
    const el = track.current;
    if (!el) return;
    const next = (n + photos.length) % photos.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setI(next);
  }

  return (
    <div aria-roledescription="carousel" aria-label={alt}>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line">
        <div
          ref={track}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setI(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {photos.map((v, k) => (
            <div key={k} className="h-full w-full shrink-0 snap-center" role="group" aria-roledescription="slide" aria-label={`ছবি ${toBnDigits(k + 1)} / ${toBnDigits(photos.length)}`}>
              <FlockArt category={category} seed={seed + k * 13} variant={v} className="h-full w-full" />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(i - 1)} aria-label="আগের ছবি" className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow md:grid">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="পরের ছবি" className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow md:grid">
              <ChevronRight className="size-5" />
            </button>
            <span className="num absolute right-3 top-3 rounded-full bg-ink/65 px-2.5 py-0.5 text-[13px] text-white">
              {toBnDigits(i + 1)}/{toBnDigits(photos.length)}
            </span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2">
          {photos.map((v, k) => (
            <button
              key={k}
              type="button"
              onClick={() => go(k)}
              aria-label={`ছবি ${toBnDigits(k + 1)} দেখুন`}
              aria-current={k === i ? "true" : undefined}
              className={`w-16 overflow-hidden rounded-lg border-2 sm:w-20 ${k === i ? "border-field-700" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <FlockArt category={category} seed={seed + k * 13} variant={v} className="aspect-[4/3] w-full" label={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

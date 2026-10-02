"use client";
import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet } from "../ui/Sheet";
import { toBnDigits } from "@/lib/format";

/** Mobile wrapper: the server-rendered filter form opens in a bottom sheet. */
export function FilterSheetButton({ active, children }: { active: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-semibold lg:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        ফিল্টার
        {active > 0 && (
          <span className="grid size-6 place-items-center rounded-full bg-brand-700 text-[13px] text-white">{toBnDigits(active)}</span>
        )}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="ফিল্টার">
        {children}
      </Sheet>
    </>
  );
}

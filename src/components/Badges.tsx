import { BadgeCheck, CircleAlert, CircleCheck } from "lucide-react";
import type { Health } from "@/lib/types";

export function HealthBadge({ health }: { health: Health }) {
  return health === "HEALTHY" ? (
    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ok">
      <CircleCheck className="size-3.5" aria-hidden /> সুস্থ
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded bg-bad-50 px-1.5 text-[13px] font-semibold text-bad">
      <CircleAlert className="size-3.5" aria-hidden /> অসুস্থ
    </span>
  );
}

export function VerifiedBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-field-100 font-semibold text-field-800 ${small ? "px-2 py-0.5 text-[12px]" : "px-2.5 py-1 text-[13px]"}`}
    >
      <BadgeCheck className={small ? "size-3.5" : "size-4"} aria-hidden /> যাচাইকৃত বিক্রেতা
    </span>
  );
}

import type { CategorySlug } from "@/lib/types";
import { artPath } from "@/lib/flock-art";

/**
 * Demo flock illustration, loaded as a cached SVG image rather than inline markup
 * (inline drawing put thousands of nodes in the DOM). Decorative: empty alt.
 */
export function FlockArt({
  category,
  seed,
  variant = 0,
  className = "",
  label = true,
  eager = false,
}: {
  category: CategorySlug;
  seed: number;
  variant?: number;
  className?: string;
  label?: boolean;
  /** Load immediately (above-the-fold hero images); everything else is lazy. */
  eager?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#ECE9E1] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG; next/image adds nothing here */}
      <img
        src={artPath(category, variant, seed)}
        alt=""
        width={400}
        height={300}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        className="block h-full w-full object-cover"
      />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-ink/55 px-1.5 py-0.5 text-[10px] font-medium text-white">ডেমো ছবি</span>
      )}
    </div>
  );
}

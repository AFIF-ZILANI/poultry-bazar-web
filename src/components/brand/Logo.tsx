import { MARK_GEOMETRY as G, markColors, type MarkVariant } from "@/lib/brand";

/**
 * The price-tag hen (docs/design.md, Logo). Geometry lives in src/lib/brand.ts.
 * `tile` for icons and small square spots, `bare` next to the wordmark on light backgrounds,
 * `reverse` on indigo, `mono` for one-colour print.
 */
export function LogoMark({ variant = "tile", className = "size-10", title }: { variant?: MarkVariant; className?: string; title?: string }) {
  const c = markColors(variant);
  const hen = (
    <g transform={G.rotate}>
      {G.comb.map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={c.comb} />
      ))}
      <path d={G.tag} fill={c.body} />
      {c.wattle && <path d={G.wattle} fill={c.comb} />}
      <path d={G.beak} fill={c.beak} />
      <circle cx={G.eye[0]} cy={G.eye[1]} r={G.eye[2]} fill={c.eye} />
    </g>
  );
  return (
    <svg
      viewBox={variant === "tile" ? "0 0 64 64" : G.bareViewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {variant === "tile" ? (
        <>
          <rect width="64" height="64" rx="15" fill={c.bg!} />
          <g transform={G.tileOffset}>{hen}</g>
        </>
      ) : (
        hen
      )}
    </svg>
  );
}

/** Lockup: mark + wordmark. "BAZAR" carries the weight; the Bangla name sits underneath. */
export function Logo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark variant={inverted ? "reverse" : "bare"} className="h-10 w-11 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[22px] tracking-[-0.01em] ${inverted ? "text-white" : "text-brand-900"}`}>
          <span className="font-medium">Poultry</span> <span className="font-extrabold">BAZAR</span>
        </span>
        {!compact && (
          <span className={`mt-1 text-[12.5px] font-medium ${inverted ? "text-brand-200" : "text-muted"}`}>পোল্ট্রি বাজার · খামার থেকে সরাসরি</span>
        )}
      </span>
    </span>
  );
}

// 14-day price sparkline. Single series, so no legend; always shown next to the number it summarises.
// Line colour #1F7A49 validated with the dataviz palette checker (lightness, chroma, contrast).
export function Sparkline({ values, className = "h-8 w-24", label }: { values: number[]; className?: string; label: string }) {
  const w = 96;
  const h = 32;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [pad + (i * (w - pad * 2)) / (values.length - 1), pad + (1 - (v - min) / span) * (h - pad * 2)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label={label}>
      <path d={`${d} L${ex} ${h} L${pad} ${h} Z`} fill="#1F7A49" opacity="0.1" />
      <path d={d} fill="none" stroke="#1F7A49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r="4" fill="#1F7A49" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

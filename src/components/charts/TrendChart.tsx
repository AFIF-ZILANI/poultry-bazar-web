"use client";
import { useMemo, useRef, useState } from "react";
import type { RatePoint } from "@/lib/types";
import { bn, dateBn } from "@/lib/format";

/**
 * 14-day price trend for one category. Single series: no legend, the card title names it.
 * Crosshair snaps to the nearest day on pointer and arrow keys; every value is also in the rates table.
 */
export function TrendChart({ points, title }: { points: RatePoint[]; title: string }) {
  const W = 560;
  const H = 200;
  const m = { t: 16, r: 56, b: 28, l: 44 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { ticks, y, x, d, area } = useMemo(() => {
    const vals = points.map((p) => p.price);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const step = niceStep((hi - lo) / 3 || 5);
    const tMin = Math.floor(lo / step) * step;
    const tMax = Math.ceil(hi / step) * step;
    const ticks: number[] = [];
    for (let v = tMin; v <= tMax + 0.001; v += step) ticks.push(v);
    const y = (v: number) => m.t + (1 - (v - tMin) / (tMax - tMin || 1)) * ih;
    const x = (i: number) => m.l + (i * iw) / (points.length - 1);
    const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.price).toFixed(1)}`).join(" ");
    const area = `${d} L${x(points.length - 1)} ${m.t + ih} L${m.l} ${m.t + ih} Z`;
    return { ticks, y, x, d, area };
  }, [points, ih, iw, m.l, m.t]);

  const last = points.length - 1;
  const active = hover ?? last;
  const p = points[active];
  const prev = points[active - 1];

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(last, Math.round(((px - m.l) / iw) * last))));
  }

  return (
    <figure className="m-0">
      <div className="mb-2 flex items-baseline justify-between gap-3" aria-live="polite">
        <figcaption className="text-[15px] font-semibold">{title}</figcaption>
        <p className="text-right text-[13px] text-muted">
          {dateBn(p.date)}: <span className="num text-[16px] font-bold text-ink">৳{bn(p.price)}</span>
          {prev && (
            <span className="ml-1">
              ({p.price - prev.price >= 0 ? "+" : "−"}
              {bn(Math.abs(p.price - prev.price))})
            </span>
          )}
          <span className="ml-1">· {bn(p.sales)}টি বিক্রি</span>
        </p>
      </div>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-pan-y select-none"
        role="img"
        aria-label={`${title}: ${dateBn(points[0].date)} থেকে ${dateBn(points[last].date)} পর্যন্ত দর ৳${bn(points[0].price)} থেকে ৳${bn(points[last].price)}। তীর কী দিয়ে দিন বদলান।`}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover(Math.max(0, active - 1));
          if (e.key === "ArrowRight") setHover(Math.min(last, active + 1));
        }}
        onBlur={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={m.l + iw} y1={y(t)} y2={y(t)} stroke="#E6E5DF" strokeWidth="1" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#565C6B" className="num">
              {bn(t)}
            </text>
          </g>
        ))}
        {[0, Math.floor(last / 2), last].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} fontSize="11" fill="#565C6B">
            {dateBn(points[i].date)}
          </text>
        ))}
        <path d={area} fill="#2F48B0" opacity="0.1" />
        <path d={d} fill="none" stroke="#2F48B0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && <line x1={x(active)} x2={x(active)} y1={m.t} y2={m.t + ih} stroke="#9C9FAA" strokeWidth="1" />}
        <circle cx={x(active)} cy={y(p.price)} r="5" fill="#2F48B0" stroke="#fff" strokeWidth="2" />
        <text x={x(last) + 10} y={y(points[last].price) + 4} fontSize="12" fontWeight="700" fill="#161A26" className="num">
          ৳{bn(points[last].price)}
        </text>
      </svg>
    </figure>
  );
}

function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

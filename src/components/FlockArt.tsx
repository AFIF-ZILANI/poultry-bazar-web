import type { CategorySlug } from "@/lib/types";

// Drawn stand-in for farmer photos in the prototype (docs/design.md, Imagery). Deterministic per seed.

type Palette = { body: string[]; shade: string; comb: string | null; beak: string };
const PALETTES: Record<CategorySlug, Palette> = {
  broiler: { body: ["#FBFAF5"], shade: "#E4DFCF", comb: "#D9461A", beak: "#F2B807" },
  sonali: { body: ["#C98632", "#B8752A", "#D69A45"], shade: "#8E5A1E", comb: "#C9351A", beak: "#F2B807" },
  layer: { body: ["#8C4B2C", "#7A3F24"], shade: "#5C2E19", comb: "#D9461A", beak: "#F2B807" },
  deshi: { body: ["#2F2A25", "#A0522D", "#D9A441", "#5B4636"], shade: "#1F1B17", comb: "#C9351A", beak: "#D9A12E" },
  duck: { body: ["#F6F3EA", "#B79A63"], shade: "#D9D2BF", comb: null, beak: "#E8902F" },
  quail: { body: ["#8A6A45", "#9C7A50"], shade: "#5E4628", comb: null, beak: "#4A3A28" },
};

const SCENES = [
  { wall: "#ECE9E1", floor: "#E3D3A8", floorDark: "#D2BF8C", light: "#F7F3DF" },
  { wall: "#E9E4D6", floor: "#DCC99A", floorDark: "#C9B27C", light: "#FBF1D2" },
  { wall: "#E4E3DD", floor: "#E6D8B2", floorDark: "#D4C291", light: "#F3F1EA" },
  { wall: "#EDE7DA", floor: "#D8C495", floorDark: "#C4AD78", light: "#FFF4DA" },
];

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Bird({ x, y, s, flip, color, p, kind }: { x: number; y: number; s: number; flip: boolean; color: string; p: Palette; kind: CategorySlug }) {
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  if (kind === "duck") {
    return (
      <g transform={t}>
        <ellipse cx="0" cy="0" rx="22" ry="12" fill={color} />
        <path d="M-20 -2 L-30 -10 L-22 4 Z" fill={color} />
        <path d="M10 -6 Q14 -20 16 -24" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="17" cy="-25" r="7" fill={color} />
        <path d="M22 -27 L33 -24 L22 -21 Z" fill={p.beak} />
        <circle cx="19" cy="-27" r="1.3" fill="#1d1d1d" />
        <ellipse cx="0" cy="3" rx="15" ry="5" fill={p.shade} opacity="0.35" />
      </g>
    );
  }
  if (kind === "quail") {
    return (
      <g transform={t}>
        <ellipse cx="0" cy="0" rx="14" ry="10" fill={color} />
        <circle cx="11" cy="-7" r="6" fill={color} />
        <path d="M16 -8 L20 -6.5 L16 -5 Z" fill={p.beak} />
        <circle cx="12.5" cy="-8.5" r="1.1" fill="#1d1d1d" />
        {[-6, -1, 4, -3, 2].map((dx, i) => (
          <circle key={i} cx={dx} cy={i % 2 ? 2 : -3} r="1.4" fill="#F1E6CF" opacity="0.8" />
        ))}
      </g>
    );
  }
  return (
    <g transform={t}>
      <path d="M-16 -2 L-26 -18 Q-27 -21 -24 -20 L-8 -8 Z" fill={color} />
      <ellipse cx="0" cy="0" rx="20" ry="14" fill={color} />
      <path d="M6 -6 Q8 -16 13 -19 L18 -14 Q17 -7 13 -2 Z" fill={color} />
      {p.comb && (
        <>
          <circle cx="11" cy="-25.5" r="2.6" fill={p.comb} />
          <circle cx="14.5" cy="-27" r="2.8" fill={p.comb} />
          <circle cx="18" cy="-25.5" r="2.4" fill={p.comb} />
        </>
      )}
      <circle cx="14" cy="-20" r="7" fill={color} />
      <path d="M20 -21.5 L25.5 -19.5 L20 -17.5 Z" fill={p.beak} />
      {p.comb && <ellipse cx="19.5" cy="-14.5" rx="1.6" ry="2.4" fill={p.comb} />}
      <circle cx="16" cy="-21.5" r="1.3" fill="#1d1d1d" />
      <path d="M-10 0 Q-1 7 9 1" stroke={p.shade} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

export function FlockArt({
  category,
  seed,
  variant = 0,
  className = "",
  label = true,
}: {
  category: CategorySlug;
  seed: number;
  variant?: number;
  className?: string;
  label?: boolean;
}) {
  const p = PALETTES[category];
  const sc = SCENES[variant % SCENES.length];
  const r = rng(seed + variant * 101);
  const size = category === "quail" ? 0.8 : category === "deshi" ? 1.1 : 1;
  const birds: { x: number; y: number; s: number; flip: boolean; color: string }[] = [];
  const rows = category === "deshi" ? 3 : 5;
  for (let row = 0; row < rows; row++) {
    const y = 150 + row * (150 / rows) + r() * 8;
    const scale = (0.55 + row * 0.16) * size;
    const n = Math.round((category === "deshi" ? 3 : 7) - row * 0.6);
    for (let i = 0; i < n; i++) {
      birds.push({
        x: (400 / n) * i + r() * (380 / n) + 10,
        y,
        s: scale * (0.92 + r() * 0.16),
        flip: r() > 0.5,
        color: p.body[Math.floor(r() * p.body.length)],
      });
    }
  }
  return (
    <div className={`relative overflow-hidden bg-[#ECE9E1] ${className}`}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" aria-hidden>
        <rect width="400" height="300" fill={sc.wall} />
        {/* side-wall curtain openings, typical of BD open-sided sheds */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={12 + i * 80} y="38" width="58" height="58" rx="3" fill={sc.light} />
        ))}
        <rect y="30" width="400" height="8" fill="#8C8778" opacity="0.35" />
        <rect y="96" width="400" height="6" fill="#8C8778" opacity="0.3" />
        <rect y="122" width="400" height="178" fill={sc.floor} />
        <rect y="122" width="400" height="10" fill={sc.floorDark} opacity="0.7" />
        {/* feeder line */}
        <rect x="0" y="134" width="400" height="3" fill="#8A8F84" opacity="0.5" />
        {[40, 140, 240, 340].map((x) => (
          <ellipse key={x} cx={x} cy="142" rx="16" ry="5" fill="#C24E25" opacity="0.75" />
        ))}
        {birds.map((b, i) => (
          <Bird key={i} {...b} p={p} kind={category} />
        ))}
      </svg>
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-ink/55 px-1.5 py-0.5 text-[10px] font-medium text-white">ডেমো ছবি</span>
      )}
    </div>
  );
}

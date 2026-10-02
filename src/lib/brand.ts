// Logo geometry: the single source for every use of the mark (docs/design.md, Logo).
// Concept: a hen drawn as a price tag. The tag's point is the head, its string hole is the eye,
// so one shape says "poultry" and "market price". Tilted -18° so the hen leans forward.

export const BRAND = {
  indigo: "#24337E",
  indigoDeep: "#141C47",
  vermilion: "#D9461A",
  yolk: "#F2B807",
  paper: "#F5F4F0",
  ink: "#161A26",
} as const;

export const MARK_GEOMETRY = {
  rotate: "rotate(-18 32 37)",
  tag: "M15 22 H36.5 L53 35.4 Q54.6 37 53 38.6 L36.5 52 H15 Q9 52 9 46 V28 Q9 22 15 22 Z",
  comb: [
    [37.2, 21.8, 4.3],
    [42.6, 23.6, 4.5],
    [47.4, 27.6, 4],
  ] as [number, number, number][],
  wattle: "M46.4 42.2 q2.2 6 -1.2 8.6 q-3 -3 -0.6 -7.6 Z",
  beak: "M53.4 34.2 L61 37 L53.4 39.8 Z",
  eye: [44.2, 37, 3.3] as [number, number, number],
  /** viewBox that crops the bare mark tightly. */
  bareViewBox: "3 6 60 54",
  /** Offset that optically centres the mark on the 64×64 tile. */
  tileOffset: "translate(-1.5 -3)",
};

export type MarkVariant = "tile" | "bare" | "reverse" | "mono";

export function markColors(v: MarkVariant) {
  switch (v) {
    case "tile":
      return { bg: BRAND.indigo, body: BRAND.paper, eye: BRAND.indigo, comb: BRAND.vermilion, beak: BRAND.yolk, wattle: true };
    case "bare":
      return { bg: null, body: BRAND.indigo, eye: BRAND.paper, comb: BRAND.vermilion, beak: BRAND.yolk, wattle: true };
    case "reverse":
      return { bg: null, body: BRAND.paper, eye: BRAND.indigoDeep, comb: BRAND.vermilion, beak: BRAND.yolk, wattle: true };
    case "mono":
      return { bg: null, body: BRAND.ink, eye: "#FFFFFF", comb: BRAND.ink, beak: BRAND.ink, wattle: false };
  }
}

/** Standalone SVG string (for OG images, icons and the files in public/brand). */
export function markSvg(v: MarkVariant): string {
  const c = markColors(v);
  const g = MARK_GEOMETRY;
  const hen =
    `<g transform="${g.rotate}">` +
    g.comb.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.comb}"/>`).join("") +
    `<path d="${g.tag}" fill="${c.body}"/>` +
    (c.wattle ? `<path d="${g.wattle}" fill="${c.comb}"/>` : "") +
    `<path d="${g.beak}" fill="${c.beak}"/>` +
    `<circle cx="${g.eye[0]}" cy="${g.eye[1]}" r="${g.eye[2]}" fill="${c.eye}"/></g>`;
  return v === "tile"
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="${c.bg}"/><g transform="${g.tileOffset}">${hen}</g></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${g.bareViewBox}">${hen}</svg>`;
}

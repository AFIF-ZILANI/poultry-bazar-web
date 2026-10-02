import { markSvg } from "./brand";
// Shared pieces for generated Open Graph images. Satori cannot shape Bangla conjuncts reliably,
// so share cards use English text (docs/seo.md). Page titles and descriptions stay Bangla.
const MARK = markSvg("tile");

export const OG_SIZE = { width: 1200, height: 630 };
export const MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`;

export function OgFrame({ eyebrow, title, lines, price }: { eyebrow: string; title: string; lines: string[]; price?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F5F4F0", padding: 64, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK_SRC} width={72} height={72} alt="" />
        <div style={{ display: "flex", fontSize: 38, color: "#141C47" }}>
          <span>Poultry&nbsp;</span>
          <span style={{ fontWeight: 800 }}>BAZAR</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 56, flex: 1 }}>
        <div style={{ fontSize: 28, color: "#D9461A", fontWeight: 700, letterSpacing: 2 }}>{eyebrow}</div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "#161A26", marginTop: 12, lineHeight: 1.05 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 34, color: "#565C6B" }}>
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: 26, color: "#565C6B" }}>poultrybazarbd.com</span>
        {price ? (
          <span style={{ fontSize: 56, fontWeight: 800, color: "#FFFFFF", background: "#24337E", padding: "12px 28px", borderRadius: 18 }}>{price}</span>
        ) : null}
      </div>
    </div>
  );
}

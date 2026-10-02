// Shared pieces for generated Open Graph images. Satori cannot shape Bangla conjuncts reliably,
// so share cards use English text (docs/seo.md). Page titles and descriptions stay Bangla.
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#17633A"/><circle cx="35.5" cy="17.5" r="3.6" fill="#D2461B"/><circle cx="40.5" cy="15.2" r="3.9" fill="#D2461B"/><circle cx="45.4" cy="17.6" r="3.4" fill="#D2461B"/><path d="M14 41 L8.5 22.5 Q8.2 20.6 10 21.6 L26 31 Z" fill="#F6F5EF"/><ellipse cx="29" cy="40.5" rx="17.5" ry="13" fill="#F6F5EF"/><path d="M33 34 Q35 25 40.5 21 L46 26 Q45 33 41 38 Z" fill="#F6F5EF"/><circle cx="41" cy="26" r="8.6" fill="#F6F5EF"/><path d="M48.8 23.6 L55.2 26.6 L48.8 29.6 Z" fill="#E8B547"/><ellipse cx="47.3" cy="32.6" rx="2.1" ry="2.8" fill="#D2461B"/><circle cx="43.4" cy="24.6" r="1.7" fill="#0F3D24"/><path d="M19 39.5 Q27 47 37 40" fill="none" stroke="#C5DCCB" stroke-width="2.6" stroke-linecap="round"/></svg>`;

export const OG_SIZE = { width: 1200, height: 630 };
export const MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`;

export function OgFrame({ eyebrow, title, lines, price }: { eyebrow: string; title: string; lines: string[]; price?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F6F5EF", padding: 64, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MARK_SRC} width={72} height={72} alt="" />
        <div style={{ display: "flex", fontSize: 38, color: "#0F3D24" }}>
          <span>Poultry&nbsp;</span>
          <span style={{ fontWeight: 800 }}>BAZAR</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 56, flex: 1 }}>
        <div style={{ fontSize: 28, color: "#D2461B", fontWeight: 700, letterSpacing: 2 }}>{eyebrow}</div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "#18211B", marginTop: 12, lineHeight: 1.05 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 34, color: "#536058" }}>
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: 26, color: "#536058" }}>poultrybazarbd.com</span>
        {price ? (
          <span style={{ fontSize: 56, fontWeight: 800, color: "#FFFFFF", background: "#17633A", padding: "12px 28px", borderRadius: 18 }}>{price}</span>
        ) : null}
      </div>
    </div>
  );
}

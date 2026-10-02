// Writes the logo SVG files from src/lib/brand.ts so they never drift from the code.
// Run: npm run brand (Node 22+ runs TypeScript directly)
import { writeFileSync } from "node:fs";
import { markSvg, type MarkVariant } from "../src/lib/brand.ts";

const variants: MarkVariant[] = ["tile", "bare", "reverse", "mono"];
for (const v of variants) writeFileSync(`public/brand/mark-${v}.svg`, markSvg(v) + "\n");
writeFileSync("src/app/icon.svg", markSvg("tile") + "\n");
console.log("wrote public/brand/mark-{tile,bare,reverse,mono}.svg and src/app/icon.svg");

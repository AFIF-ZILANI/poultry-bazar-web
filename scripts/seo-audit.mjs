// SEO crawler: fetches robots.txt and sitemap.xml, crawls every internal page and reports issues
// (foreign canonicals/OG images, missing tags, duplicate titles, noindex pages in the sitemap, broken links).
// Usage: npm run seo:audit -- <base-url> [public-origin]   e.g. npm run seo:audit -- https://poultry-bazar.vercel.app
const BASE = process.argv[2] || 'http://127.0.0.1:3100';
const PUBLIC = process.argv[3] || BASE;
const issues = []; const pages = {};
const add = (sev, page, msg) => issues.push({ sev, page, msg });
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`, 'i')) || [])[1];
const metas = (html) => [...html.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]);
const meta = (html, key) => { const t = metas(html).find((m) => attr(m, 'name') === key || attr(m, 'property') === key); return t ? attr(t, 'content') : undefined; };
const dec = (s) => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

async function get(path) { const r = await fetch(BASE + path, { redirect: 'manual' }); return { status: r.status, headers: r.headers, text: r.status < 400 ? await r.text() : '' }; }

// robots + sitemap
const robots = await get('/robots.txt');
console.log('--- robots.txt\n' + robots.text);
if (/^Host:/m.test(robots.text)) add('low', '/robots.txt', 'non-standard Host: directive');
if (!robots.text.includes(`Sitemap: ${PUBLIC}/sitemap.xml`)) add('high', '/robots.txt', `Sitemap line does not point at ${PUBLIC}`);
const sm = await get('/sitemap.xml');
const smUrls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const foreign = smUrls.filter((u) => !u.startsWith(PUBLIC));
if (foreign.length) add('critical', '/sitemap.xml', `${foreign.length}/${smUrls.length} sitemap URLs are on another domain, e.g. ${foreign[0]}`);

// crawl: start from home + sitemap paths, follow internal links
const queue = new Set(['/', ...smUrls.map((u) => new URL(u).pathname)]);
const seen = new Set(); const titles = {}; const descs = {}; const broken = new Set();
for (const path of queue) {
  if (seen.has(path) || seen.size > 260) continue; seen.add(path);
  const r = await get(path);
  if (r.status >= 300) { if (r.status >= 400) broken.add(`${path} → ${r.status}`); continue; }
  if (!(r.headers.get('content-type') || '').includes('text/html')) continue;
  const h = r.text;
  const title = dec((h.match(/<title>([^<]*)<\/title>/) || [])[1]);
  const desc = dec(meta(h, 'description'));
  const canon = attr((h.match(/<link[^>]*rel="canonical"[^>]*>/) || [''])[0], 'href');
  const robotsMeta = meta(h, 'robots');
  const ogImg = meta(h, 'og:image'); const ogUrl = meta(h, 'og:url'); const ogTitle = meta(h, 'og:title');
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  const imgsNoAlt = [...h.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt=/.test(m[0])).length;
  const lang = attr((h.match(/<html[^>]*>/) || [''])[0], 'lang');
  const noindex = robotsMeta?.includes('noindex');
  const selfCanon = canon && new URL(canon).pathname + new URL(canon).search === path;
  pages[path] = { title, desc, canon, ogImg, h1s, noindex, selfCanon };
  if (!title) add('high', path, 'missing <title>');
  else { if (!noindex && selfCanon) (titles[title] ||= []).push(path); if (title.length > 70) add('low', path, `title ${title.length} chars (>70 gets cut): ${title}`); }
  if (!noindex) {
    if (!desc) add('high', path, 'missing meta description');
    else { if (selfCanon) (descs[desc] ||= []).push(path); if (desc.length < 70) add('low', path, `description short (${desc.length})`); if (desc.length > 170) add('low', path, `description long (${desc.length})`); }
    if (!canon) add('high', path, 'missing canonical');
    else if (!canon.startsWith(PUBLIC)) add('critical', path, `canonical points to another domain: ${canon}`);
    if (!ogImg) add('medium', path, 'missing og:image');
    else if (!ogImg.startsWith(PUBLIC)) add('critical', path, `og:image on another domain (broken share preview): ${ogImg}`);
    if (!ogTitle) add('medium', path, 'missing og:title');
    if (/^\/ads\/[A-Z]{2}-\d+$/.test(path) && ogImg && !ogImg.includes(path)) add('high', path, `listing shares the generic image instead of its own: ${ogImg}`);
    if (!ogUrl) add('low', path, 'missing og:url'); else if (canon && ogUrl !== canon) add('low', path, `og:url (${ogUrl}) differs from canonical`);
    if (h1s !== 1) add('medium', path, `${h1s} <h1> elements`);
  }
  if (lang !== 'bn') add('medium', path, `html lang="${lang}"`);
  if (imgsNoAlt) add('low', path, `${imgsNoAlt} <img> without alt`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); const s = JSON.stringify(j); const ext = [...s.matchAll(/https?:\/\/[^"\\]+/g)].map((x) => x[0]).filter((u) => !u.startsWith(PUBLIC) && !u.includes('schema.org') && !u.includes('dl.poultrybazarbd.com'));
      if (ext.length) add('high', path, `JSON-LD URLs on another domain: ${ext[0]}`); } catch (e) { add('high', path, 'invalid JSON-LD: ' + e.message); }
  }
  for (const m of h.matchAll(/href="(\/[^"#]*)"/g)) { const p = dec(m[1]); if (!p.startsWith('/_next') && !seen.has(p)) queue.add(p); }
}
for (const u of smUrls) { const p = new URL(u).pathname; if (pages[p]?.noindex) add('high', p, 'in sitemap but noindex'); else if (pages[p] && !pages[p].selfCanon) add('high', p, 'in sitemap but canonical points elsewhere'); }
for (const [t, ps] of Object.entries(titles)) if (ps.length > 1 && !ps.every((p) => pages[p].noindex)) add('medium', ps.join(', '), `duplicate title: ${t}`);
for (const ps of Object.values(descs)) if (ps.length > 1) add('medium', ps.slice(0, 4).join(', ') + (ps.length > 4 ? ` (+${ps.length - 4})` : ''), `duplicate description`);
for (const b of broken) add('high', b.split(' ')[0], `broken internal link target: ${b}`);
// OG image fetchable locally?
const og = await get('/opengraph-image'); if (og.status !== 200) add('high', '/opengraph-image', 'OG image does not render');

const order = { critical: 0, high: 1, medium: 2, low: 3 };
issues.sort((a, b) => order[a.sev] - order[b.sev]);
const counts = issues.reduce((c, i) => ((c[i.sev] = (c[i.sev] || 0) + 1), c), {});
console.log(`\nCrawled ${seen.size} URLs, ${Object.keys(pages).length} HTML pages. Issues:`, JSON.stringify(counts));
const grouped = {};
for (const i of issues) { const key = i.sev + ' | ' + i.msg.replace(/[A-Z]{2}-\d+|\/ads\/[^ ]+|\d+ chars|\(\d+\)/g, '…').slice(0, 110); (grouped[key] ||= []).push(i.page); }
for (const [k, ps] of Object.entries(grouped)) console.log(`${k}  [${ps.length}] e.g. ${ps.slice(0, 3).join(' ; ')}`);

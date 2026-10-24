/**
 * Teče po `next build`. Prava stran ali testna stran (src/config/env.ts: SITE_ENV, WORKERS_CI_BRANCH, …); zapiše v out/:
 * - prava:   _headers brez noindex, običajen robots.txt in sitemap.xml
 * - testna:  _headers z X-Robots-Tag: noindex, nofollow, robots.txt z Disallow: /, brez sitemapa
 * - /uredi:  stran urejevalnika Inženirji.si (samo embed.js), dokler editor.config.json → enabled ni true pa »kmalu«.
 *            Brez glave, noge in Next skript; vedno noindex (inzenirji-widget docs/template/uredi-page.md, ADR-011).
 */
import fs from "node:fs";
import path from "node:path";
import { isLive } from "../src/config/env";
import { editorConfigSchema } from "../src/schema/editor-config";

const OUT = path.join(process.cwd(), "out");
const production = isLive();
const editor = editorConfigSchema.parse(JSON.parse(fs.readFileSync(path.join(process.cwd(), "editor.config.json"), "utf8")));
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const editorOrigin = new URL(editor.editorUrl).origin;
const urediBody = editor.enabled
  ? `<script src="${esc(editorOrigin)}/embed.js" data-site="${esc(editor.siteId)}" defer></script>`
  : `<main style="font:16px/1.5 system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 16px"><h1 style="font-size:1.4rem">Urejevalnik prihaja kmalu</h1><p>Urejanje strani prek pogovora bo kmalu na voljo.</p></main>`;
fs.mkdirSync(path.join(OUT, "uredi"), { recursive: true });
fs.writeFileSync(
  path.join(OUT, "uredi", "index.html"),
  `<!doctype html>
<html lang="sl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Urejevalnik · ${esc(editor.siteName)}</title>
<style>html,body{margin:0;height:100%;background:#fff}</style>
</head>
<body>
${urediBody}
</body>
</html>
`,
);
const site = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf8")) as { url: string };

const headers = [
  // predpomnjenje: Next datoteke imajo hash v imenu (za vedno), slike lahko urejevalnik zamenja (teden + osvežitev v ozadju)
  "/_next/static/*",
  "  Cache-Control: public, max-age=31536000, immutable",
  "",
  "/uploads/*",
  "  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000",
  "",
  "/uredi",
  "  X-Robots-Tag: noindex, nofollow",
  "",
  "/uredi/*",
  "  X-Robots-Tag: noindex, nofollow",
  "",
  ...(production ? [] : ["/*", "  X-Robots-Tag: noindex, nofollow", ""]),
].join("\n");
fs.writeFileSync(path.join(OUT, "_headers"), headers);

if (production) {
  fs.writeFileSync(
    path.join(OUT, "robots.txt"),
    `User-Agent: *\nAllow: /\nDisallow: /uredi/\n\nSitemap: ${new URL("/sitemap.xml", site.url)}\n`,
  );
  if (!fs.existsSync(path.join(OUT, "sitemap.xml"))) throw new Error("sitemap.xml manjka v produkcijskem buildu");
} else {
  fs.writeFileSync(path.join(OUT, "robots.txt"), "User-Agent: *\nDisallow: /\n");
  fs.rmSync(path.join(OUT, "sitemap.xml"), { force: true });
}
console.log(`✓ postbuild: ${production ? "prava stran" : "testna stran"}; /uredi: ${editor.enabled ? `urejevalnik ${editorOrigin} (site ${editor.siteId})` : "kmalu"}`);

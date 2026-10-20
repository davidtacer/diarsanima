/**
 * Teče po `next build`. Glede na vejo, ki jo gradi Cloudflare Pages (CF_PAGES_BRANCH), zapiše v out/:
 * - main:   _headers brez noindex, običajen robots.txt in sitemap.xml
 * - ostalo: _headers z X-Robots-Tag: noindex, nofollow, robots.txt z Disallow: /, brez sitemapa
 * Lokalno (brez CF_PAGES_BRANCH) odloča NEXT_PUBLIC_ENV=production.
 * /uredi ima noindex vedno.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const branch = process.env.CF_PAGES_BRANCH;
const production = branch ? branch === "main" : process.env.NEXT_PUBLIC_ENV === "production";
const site = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf8")) as { url: string };

const headers = [
  // predpomnjenje: Next datoteke imajo hash v imenu (za vedno), slike lahko urejevalnik zamenja (teden + osvežitev v ozadju)
  "/_next/static/*",
  "  Cache-Control: public, max-age=31536000, immutable",
  "",
  "/uploads/*",
  "  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000",
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
console.log(`✓ postbuild: ${production ? "produkcija (main)" : `testna stran (${branch ?? "lokalno"})`}`);

/**
 * Enkratni prenos slik z obstoječe WordPress strani v public/uploads (mapa: scripts/wp-sources.json),
 * nato pretvorba v WebP + velikosti (optimize-uploads). Po prenosu slike commitaj, stran od WP ni več odvisna.
 * Uporaba: npm run uploads:wp
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const sources: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, "wp-sources.json"), "utf8"));

async function main() {
  let ok = 0;
  for (const [local, url] of Object.entries(sources)) {
    const target = path.join(process.cwd(), "public", local);
    if (fs.existsSync(target)) continue;
    const ext = path.extname(new URL(url).pathname) || ".png";
    const raw = target.replace(/\.webp$/, ext);
    fs.mkdirSync(path.dirname(raw), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("✗", local, res.status);
      continue;
    }
    fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    execFileSync("npx", ["tsx", path.join(__dirname, "optimize-uploads.ts"), raw], { stdio: "inherit" });
    ok++;
  }
  console.log(`Preneseno: ${ok}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

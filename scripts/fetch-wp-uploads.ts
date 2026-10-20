/**
 * Enkratni prenos slik z obstoječe WordPress strani v public/uploads (mapa: scripts/wp-sources.json),
 * nato pretvorba v WebP + velikosti (optimize-uploads). Po prenosu slike commitaj, stran od WP ni več odvisna.
 * Uporaba: yarn uploads:wp
 */
import fs from "node:fs";
import path from "node:path";
import { optimizeFile } from "./optimize-uploads";

const sources: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, "wp-sources.json"), "utf8"));

async function main() {
  let ok = 0;
  for (const [local, url] of Object.entries(sources)) {
    const target = path.join(process.cwd(), "public", local);
    if (fs.existsSync(target)) continue;
    const ext = path.extname(new URL(url).pathname) || ".png";
    const raw = target.replace(/\.webp$/, ext);
    fs.mkdirSync(path.dirname(raw), { recursive: true });
    // WP strežnik (Cloudflare) občasno vrne 5xx, npr. 522 — poskusi do 4-krat z zamikom
    let res: Response | undefined;
    for (let attempt = 1; attempt <= 4; attempt++) {
      res = await fetch(url).catch(() => undefined);
      if (res?.ok || (res && res.status < 500)) break;
      await new Promise((r) => setTimeout(r, attempt * 3000));
    }
    if (!res?.ok) {
      console.warn("✗", local, res?.status ?? "napaka povezave", "— poženi ukaz znova");
      continue;
    }
    fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    await optimizeFile(raw);
    ok++;
  }
  console.log(`Preneseno: ${ok}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

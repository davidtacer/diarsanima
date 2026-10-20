/**
 * Teče pred `next dev` in `next build`. Zapiše src/config/build.ts:
 * - BUILD_UPDATED_AT: datum zadnjega commita (git log -1 --format=%cI) za podpis v nogi; brez gita čas builda,
 * - SITE_HOST: domena stranke iz content/site.json (SmartLink po njej loči notranje in zunanje povezave).
 * Datoteka je generirana in ni v gitu.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

let updatedAt: string;
try {
  updatedAt = execSync("git log -1 --format=%cI", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  if (!updatedAt) throw new Error("prazen git log");
} catch {
  updatedAt = new Date().toISOString();
}

// domena stranke (za SmartLink: povezava na drugo domeno je zunanja)
const site = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf8")) as { url: string };
const host = new URL(site.url).hostname.replace(/^www\./, "");

const out = path.join(process.cwd(), "src/config/build.ts");
fs.writeFileSync(
  out,
  `// Generirano s scripts/prebuild.ts — ne urejaj ročno.\nexport const BUILD_UPDATED_AT = ${JSON.stringify(updatedAt)};\nexport const SITE_HOST = ${JSON.stringify(host)};\n`,
);
console.log(`✓ prebuild: posodobljeno ${updatedAt}`);

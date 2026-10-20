/**
 * Teče pred `next dev` in `next build`. Zapiše src/config/build.ts z datumom zadnjega commita
 * (git log -1 --format=%cI) za podpis Inženirji.si v nogi. Če git ni na voljo, uporabi čas builda.
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

const out = path.join(process.cwd(), "src/config/build.ts");
fs.writeFileSync(
  out,
  `// Generirano s scripts/prebuild.ts — ne urejaj ročno.\nexport const BUILD_UPDATED_AT = ${JSON.stringify(updatedAt)};\n`,
);
console.log(`✓ prebuild: posodobljeno ${updatedAt}`);

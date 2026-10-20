/**
 * Pripravi slike v public/uploads za statični izvoz:
 * - vsako sliko pretvori v WebP (največ 2400 px širine, brez EXIF/metapodatkov),
 * - ustvari velikosti -640, -1280, -2400 (samo manjše od izvirnika) za srcset.
 * Uporaba: npm run uploads            (obdela vse)
 *          npm run uploads -- <pot>   (obdela eno datoteko ali mapo)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "uploads");
const SIZES = [640, 1280, 2400];
const VARIANT = /-(640|1280|2400)\.webp$/;
const INPUT = /\.(jpe?g|png|webp|avif)$/i;

function walk(p: string): string[] {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  return fs.readdirSync(p).flatMap((f) => walk(path.join(p, f)));
}

async function processFile(file: string) {
  if (!INPUT.test(file) || VARIANT.test(file)) return;
  const base = file.replace(INPUT, "");
  const out = `${base}.webp`;
  const img = sharp(file, { failOn: "none" }).rotate(); // rotate() upošteva EXIF orientacijo, nato metapodatke zavržemo
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? 2400, 2400);
  const buf = await img.resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  for (const w of SIZES) {
    if (w >= (meta.width ?? 0) && w !== SIZES[0]) continue;
    await sharp(buf).resize({ width: Math.min(w, width), withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${base}-${w}.webp`);
  }
  fs.writeFileSync(out, buf);
  if (path.resolve(out) !== path.resolve(file)) fs.unlinkSync(file);
  console.log("✓", path.relative(process.cwd(), out));
}

async function main() {
  const target = process.argv[2] ? path.resolve(process.argv[2]) : ROOT;
  for (const f of walk(target)) await processFile(f);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});

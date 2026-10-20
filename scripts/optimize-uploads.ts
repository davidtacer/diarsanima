/**
 * Pripravi slike v public/uploads za statični izvoz:
 * - vsako sliko pretvori v WebP (največ 2400 px širine, brez EXIF/metapodatkov),
 * - ustvari velikosti -320 (sličice), -640, -1280, -2400 (samo manjše od izvirnika) za srcset.
 * Uporaba: yarn uploads                       (obdela vse)
 *          yarn uploads <pot>                 (obdela eno datoteko ali mapo)
 *          yarn uploads <pot> --variants      (na novo ustvari velikosti iz obstoječe WebP slike)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "uploads");
const SIZES = [320, 640, 1280, 2400];
const VARIANT = /-(320|640|1280|2400)\.webp$/;
const INPUT = /\.(jpe?g|png|webp|avif)$/i;
const FORCE_VARIANTS = process.argv.includes("--variants");

function walk(p: string): string[] {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  return fs.readdirSync(p).flatMap((f) => walk(path.join(p, f)));
}

export async function optimizeFile(file: string) {
  if (!INPUT.test(file) || VARIANT.test(file)) return;
  const base = file.replace(INPUT, "");
  const out = `${base}.webp`;
  const alreadyWebp = /\.webp$/i.test(file);
  // že obdelana WebP slika: ne kodiraj znova (izguba kakovosti), samo dodaj manjkajoče velikosti
  const buf = alreadyWebp
    ? fs.readFileSync(file)
    : await (async () => {
        const img = sharp(file, { failOn: "none" }).rotate(); // rotate() upošteva EXIF orientacijo, nato metapodatke zavržemo
        const meta = await img.metadata();
        return img.resize({ width: Math.min(meta.width ?? 2400, 2400), withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      })();
  const meta = await sharp(buf).metadata();
  const width = meta.width ?? 2400;
  // prosojne slike (linijske risbe, logotipi): prosojni kanal stisnemo z izgubo, brez vidne razlike, pol manjša datoteka
  const webpOptions = { quality: 80, effort: 6, ...(meta.hasAlpha ? { alphaQuality: 70 } : {}) };
  let made = 0;
  for (const w of SIZES) {
    const target = `${base}-${w}.webp`;
    if (w >= width && w !== SIZES[0]) continue;
    if (alreadyWebp && fs.existsSync(target) && !FORCE_VARIANTS) continue;
    await sharp(buf).resize({ width: Math.min(w, width), withoutEnlargement: true }).webp(webpOptions).toFile(target);
    made++;
  }
  if (!alreadyWebp) {
    fs.writeFileSync(out, buf);
    if (path.resolve(out) !== path.resolve(file)) fs.unlinkSync(file);
  }
  if (!alreadyWebp || made) console.log("✓", path.relative(process.cwd(), out), alreadyWebp ? `(+${made} velikosti)` : "");
}

async function main() {
  const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const target = arg ? path.resolve(arg) : ROOT;
  for (const f of walk(target)) await optimizeFile(f);
}
// samo ob neposrednem zagonu (ne ob uvozu iz fetch-wp-uploads)
if (process.argv[1] && /optimize-uploads\.ts$/.test(process.argv[1]))
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });

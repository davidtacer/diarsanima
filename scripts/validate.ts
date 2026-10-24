/**
 * Validacija celotne vsebine (content/). Obvezno pred vsakim commitom.
 * Uporaba: yarn validate            (berljiv izpis)
 *          yarn validate --json  (napake kot JSON za urejevalnik)
 */
import fs from "node:fs";
import path from "node:path";
import { ZodError } from "zod";
import { pageSchema, type Page } from "../src/schema/page";
import { siteSchema, type Site } from "../src/schema/site";
import { editorConfigSchema } from "../src/schema/editor-config";

type Issue = { file: string; path: string; message: string };
const issues: Issue[] = [];
const ROOT = path.join(process.cwd(), "content");
const PUBLIC = path.join(process.cwd(), "public");
const rel = (f: string) => path.relative(process.cwd(), f);
const add = (file: string, p: (string | number)[] | string, message: string) =>
  issues.push({ file: rel(file), path: Array.isArray(p) ? p.join(".") : p, message });

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    add(file, "", `neveljaven JSON: ${(e as Error).message}`);
    return undefined;
  }
}
function parse<T>(schema: { parse: (v: unknown) => T }, file: string): T | undefined {
  const raw = readJson(file);
  if (raw === undefined) return undefined;
  try {
    return schema.parse(raw);
  } catch (e) {
    if (e instanceof ZodError) for (const i of e.issues) add(file, i.path, i.message);
    else add(file, "", String(e));
    return undefined;
  }
}

/** Vse vrednosti z določenim ključem (rekurzivno), z njihovo potjo. */
function collect(node: unknown, key: string, p: (string | number)[] = [], out: { value: unknown; path: (string | number)[]; parent: Record<string, unknown> }[] = []) {
  if (Array.isArray(node)) node.forEach((v, i) => collect(v, key, [...p, i], out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === key) out.push({ value: v, path: [...p, k], parent: node as Record<string, unknown> });
      collect(v, key, [...p, k], out);
    }
  }
  return out;
}
const strings = (node: unknown, p: (string | number)[] = [], out: { s: string; path: (string | number)[] }[] = []) => {
  if (typeof node === "string") out.push({ s: node, path: p });
  else if (Array.isArray(node)) node.forEach((v, i) => strings(v, [...p, i], out));
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) strings(v, [...p, k], out);
  return out;
};

function loadLang(dir: string) {
  const site = parse(siteSchema, path.join(dir, "site.json"));
  const pagesDir = path.join(dir, "pages");
  const pages = new Map<string, { file: string; page: Page; raw: unknown }>();
  const files = new Set<string>();
  if (!fs.existsSync(pagesDir)) {
    add(pagesDir, "", "mapa pages manjka");
    return { site, pages, files };
  }
  for (const f of fs.readdirSync(pagesDir).filter((f) => f.endsWith(".json"))) {
    files.add(f.replace(/\.json$/, ""));
    const file = path.join(pagesDir, f);
    const page = parse(pageSchema, file);
    if (!page) continue;
    if (page.slug !== f.replace(/\.json$/, "")) add(file, "slug", `slug "${page.slug}" se ne ujema z imenom datoteke`);
    pages.set(page.slug, { file, page, raw: readJson(file) });
  }
  return { site, pages, files };
}

function checkLang(
  site: Site | undefined,
  pages: Map<string, { file: string; page: Page; raw: unknown }>,
  files: Set<string>,
  siteFile: string,
) {
  if (!files.has("index")) add(path.join(ROOT, "pages/index.json"), "", "domača stran index.json mora obstajati");
  // stran obstaja, če obstaja datoteka (tudi če ima napako, ki je že javljena posebej)
  const slugs = new Set(files);
  const pageExists = (s: string) => slugs.has(s);

  if (site) {
    site.navigation.forEach((n, i) => !pageExists(n.page) && add(siteFile, ["navigation", i, "page"], `stran "${n.page}" ne obstaja`));
    for (const [k, img] of Object.entries(site.brand))
      if (!fs.existsSync(path.join(PUBLIC, img.src))) add(siteFile, ["brand", k, "src"], `slika ${img.src} ne obstaja v public/`);
  }

  for (const { file, page, raw } of pages.values()) {
    // unikatni id-ji znotraj strani
    const seen = new Map<string, string>();
    for (const { value, path: p } of collect(raw, "id")) {
      if (typeof value !== "string") continue;
      const scope = p.slice(0, -2).filter((x) => typeof x === "string").join("."); // id je unikaten znotraj istega seznama/vrste
      const key = `${scope}:${value}`;
      if (seen.has(key)) add(file, p, `podvojen id "${value}" (že na ${seen.get(key)})`);
      else seen.set(key, p.join("."));
    }
    const blockIds = page.blocks.map((b) => b.id);
    blockIds.forEach((id, i) => blockIds.indexOf(id) !== i && add(file, ["blocks", i, "id"], `podvojen id bloka "${id}"`));
    // vsa dela na strani morajo imeti unikaten id (sklici catalogue)
    const workIds = page.blocks.flatMap((b) => (b.type === "gallery" ? b.groups.flatMap((g) => g.works.map((w) => w.id)) : []));
    workIds.forEach((id, i) => workIds.indexOf(id) !== i && add(file, "blocks", `podvojen id dela "${id}"`));

    // slike obstajajo
    for (const { value, path: p } of collect(raw, "src"))
      if (typeof value === "string" && value.startsWith("/uploads/") && !fs.existsSync(path.join(PUBLIC, value)))
        add(file, p, `slika ${value} ne obstaja v public/ (yarn uploads:wp ali dodaj datoteko)`);

    // notranje povezave
    for (const { value, path: p } of collect(raw, "page"))
      if (typeof value === "string" && !pageExists(value)) add(file, p, `stran "${value}" ne obstaja`);
    for (const { value, path: p } of [...collect(raw, "explorePage"), ...collect(raw, "navParent")])
      if (typeof value === "string" && !pageExists(value)) add(file, p, `stran "${value}" ne obstaja`);
    for (const { s, path: p } of strings(raw))
      for (const m of s.matchAll(/\]\(page:([a-z0-9-]+)\)/g)) if (!pageExists(m[1])) add(file, p, `povezava page:${m[1]} kaže na neobstoječo stran`);

    // sklici na dela
    for (const { value, path: p } of [...collect(raw, "plates").flatMap((x) => (Array.isArray(x.value) ? x.value.map((v, i) => ({ value: v, path: [...x.path, i] })) : [])), ...collect(raw, "feature")]) {
      const ref = value as { page?: string; work?: string };
      if (!ref || typeof ref !== "object" || !ref.page) continue;
      const target = pages.get(ref.page)?.page;
      const ok = target?.blocks.some((b) => b.type === "gallery" && b.groups.some((g) => g.works.some((w) => w.id === ref.work)));
      if (!ok) add(file, p, `delo "${ref.work}" ne obstaja v galeriji strani "${ref.page}"`);
    }

    // en <h1> na stran
    const headings = page.blocks.filter((b) => ["glitchIntro", "shatterMenu", "catalogue", "pageHeading"].includes(b.type));
    if (headings.length !== 1) add(file, "blocks", `stran mora imeti točno en naslovni blok (glitchIntro, shatterMenu, catalogue ali pageHeading), ima ${headings.length}`);
  }
  return slugs;
}

const base = loadLang(ROOT);
const baseSlugs = checkLang(base.site, base.pages, base.files, path.join(ROOT, "site.json"));

// prevodi
if (base.site) {
  const invariant = (o: unknown): unknown =>
    Array.isArray(o)
      ? o.map(invariant)
      : o && typeof o === "object"
        ? Object.fromEntries(
            Object.entries(o)
              .filter(([k]) => ["id", "type", "src", "page", "work", "validFrom", "validUntil", "number", "slug", "blocks", "groups", "works", "items", "sections", "plates", "feature", "image", "links", "navigation", "brand", "logo", "logoLarge", "seal", "watermark", "signature", "background", "tiger", "tigerMobile", "portrait", "explorePage", "navParent", "layout"].includes(k))
              .map(([k, v]) => [k, invariant(v)]),
          )
        : o;
  for (const lang of base.site.languages.filter((l) => l !== base.site!.defaultLanguage)) {
    const dir = path.join(ROOT, "i18n", lang);
    const t = loadLang(dir);
    checkLang(t.site, t.pages, t.files, path.join(dir, "site.json"));
    for (const slug of baseSlugs) {
      if (!base.pages.has(slug)) continue;
      const tp = t.pages.get(slug);
      if (!tp) {
        add(path.join(dir, "pages", `${slug}.json`), "", `prevod strani "${slug}" za jezik ${lang} manjka`);
        continue;
      }
      const a = JSON.stringify(invariant(base.pages.get(slug)!.raw));
      const b = JSON.stringify(invariant(tp.raw));
      if (a !== b) add(tp.file, "", "prevod se mora ujemati z izvirnikom v id, type, slikah, povezavah, datumih in vrstnem redu");
    }
  }
}

// editor.config.json: povezava z urejevalnikom Inženirji.si (koda, ne vsebina)
{
  const file = path.join(process.cwd(), "editor.config.json");
  const editor = parse(editorConfigSchema, file);
  if (editor && base.site && editor.urls.live !== base.site.url.replace(/\/$/, ""))
    add(file, "urls.live", `se mora ujemati s content/site.json → url (${base.site.url})`);
  if (base.files.has("uredi")) add(path.join(ROOT, "pages/uredi.json"), "slug", "stran uredi je rezervirana za urejevalnik");
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ok: issues.length === 0, issues }, null, 2));
} else if (issues.length === 0) {
  console.log(`✓ Vsebina je veljavna (${base.pages.size} strani).`);
} else {
  for (const i of issues) console.error(`✗ ${i.file}${i.path ? ` › ${i.path}` : ""}: ${i.message}`);
  console.error(`\n${issues.length} napak.`);
}
process.exit(issues.length ? 1 : 0);

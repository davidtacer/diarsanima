import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Work } from "@/blocks/Gallery/schema";
import type { WorkRef } from "@/schema/common";
import { pageSchema, type Page } from "@/schema/page";
import { siteSchema, type Site } from "@/schema/site";
import type { BlockContext } from "./types";

/** Edino mesto, ki bere content/. */
const ROOT = path.join(process.cwd(), "content");

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));
const dirFor = (lang: string, def: string) => (lang === def ? ROOT : path.join(ROOT, "i18n", lang));

let baseSite: Site | undefined;
export function getBaseSite(): Site {
  return (baseSite ??= siteSchema.parse(readJson(path.join(ROOT, "site.json"))));
}

export function getSite(lang: string): Site {
  const base = getBaseSite();
  if (lang === base.defaultLanguage) return base;
  return siteSchema.parse(readJson(path.join(dirFor(lang, base.defaultLanguage), "site.json")));
}

/** Slugi vseh strani (brez 404). */
export function listPages(): string[] {
  return fs
    .readdirSync(path.join(ROOT, "pages"))
    .filter((f) => f.endsWith(".json") && f !== "404.json")
    .map((f) => f.replace(/\.json$/, ""));
}

export function getPage(lang: string, slug: string): Page | undefined {
  const file = path.join(dirFor(lang, getBaseSite().defaultLanguage), "pages", `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  return pageSchema.parse(readJson(file));
}

export function hrefFor(lang: string, slug: string): string {
  const def = getBaseSite().defaultLanguage;
  const prefix = lang === def ? "" : `/${lang}`;
  return slug === "index" ? prefix || "/" : `${prefix}/${slug}/`;
}

export function makeContext(lang: string): BlockContext {
  const site = getSite(lang);
  return {
    site,
    lang,
    href: (slug) => hrefFor(lang, slug),
    work: (ref: WorkRef): Work => {
      const page = getPage(lang, ref.page);
      for (const b of page?.blocks ?? [])
        if (b.type === "gallery") for (const g of b.groups) for (const w of g.works) if (w.id === ref.work) return w;
      throw new Error(`Delo ${ref.page}#${ref.work} ne obstaja`);
    },
  };
}

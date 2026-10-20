import "server-only";
import { getBaseSite, listPages } from "./content";

/** Razčleni URL segmente v { lang, slug }. Privzeti jezik nima predpone. */
export function parseSlug(segments: string[] = []): { lang: string; slug: string } | undefined {
  const site = getBaseSite();
  let [first, ...rest] = segments;
  let lang = site.defaultLanguage;
  if (first && site.languages.includes(first) && first !== site.defaultLanguage) {
    lang = first;
    [first, ...rest] = rest;
  }
  if (rest.length) return undefined;
  return { lang, slug: first ?? "index" };
}

export function allRoutes() {
  const site = getBaseSite();
  return site.languages.flatMap((lang) =>
    listPages().map((slug) => {
      const segs = [...(lang === site.defaultLanguage ? [] : [lang]), ...(slug === "index" ? [] : [slug])];
      return { lang, slug, segments: segs };
    }),
  );
}

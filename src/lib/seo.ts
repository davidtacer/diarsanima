import "server-only";
import type { Metadata } from "next";
import type { Page } from "@/schema/page";
import type { Site } from "@/schema/site";
import { getBaseSite, hrefFor, listPages, makeContext } from "./content";

/** Produkcija: Cloudflare gradi vejo main (CF_PAGES_BRANCH) ali lokalno NEXT_PUBLIC_ENV=production. */
export const isProduction = () =>
  process.env.CF_PAGES_BRANCH ? process.env.CF_PAGES_BRANCH === "main" : process.env.NEXT_PUBLIC_ENV === "production";

export function pageMetadata(page: Page, site: Site, lang: string): Metadata {
  const base = getBaseSite();
  const languages = Object.fromEntries(base.languages.map((l) => [l, hrefFor(l, page.slug)]));
  return {
    title: page.slug === "index" ? { absolute: page.title } : page.title,
    description: page.seo.description ?? site.seo.defaultDescription,
    alternates: { canonical: hrefFor(lang, page.slug), languages: base.languages.length > 1 ? languages : undefined },
    openGraph: {
      title: page.title,
      description: page.seo.description ?? site.seo.defaultDescription,
      images: page.seo.image ? [{ url: page.seo.image.src, alt: page.seo.image.alt }] : [{ url: site.brand.logoLarge.src, alt: site.brand.logoLarge.alt }],
      locale: lang,
      type: "website",
    },
    robots: isProduction() ? undefined : { index: false, follow: false },
  };
}

/** JSON-LD: umetnica (Person) + dela iz galerij na strani. */
export function jsonLd(page: Page, site: Site, lang: string) {
  const ctx = makeContext(lang);
  const url = (p: string) => new URL(hrefFor(lang, p), site.url).toString();
  const person = {
    "@context": "https://schema.org",
    "@type": site.seo.schemaType,
    name: site.name,
    url: site.url,
    description: site.seo.defaultDescription,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.seo.schemaType === "Person" ? { jobTitle: site.person.jobTitle, knowsAbout: site.person.knowsAbout } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressCountry: site.contact.address.country,
      ...(site.contact.address.street ? { streetAddress: site.contact.address.street } : {}),
      ...(site.contact.address.postalCode ? { postalCode: site.contact.address.postalCode } : {}),
    },
    image: new URL(site.brand.logoLarge.src, site.url).toString(),
    sameAs: site.social.map((s) => s.url),
  };
  const works = page.blocks.flatMap((b) => (b.type === "gallery" ? b.groups.flatMap((g) => g.works) : []));
  const out: object[] = [person];
  if (works.length)
    out.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: page.title,
      url: url(page.slug),
      itemListElement: works.map((w, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VisualArtwork",
          name: w.title,
          description: w.details,
          image: new URL(w.image.src, site.url).toString(),
          creator: { "@type": "Person", name: site.name },
        },
      })),
    });
  void ctx;
  return out;
}

export function sitemapEntries() {
  const base = getBaseSite();
  return listPages().flatMap((slug) =>
    base.languages.map((lang) => ({
      url: new URL(hrefFor(lang, slug), base.url).toString(),
      alternates:
        base.languages.length > 1
          ? { languages: Object.fromEntries(base.languages.map((l) => [l, new URL(hrefFor(l, slug), base.url).toString()])) }
          : undefined,
    })),
  );
}

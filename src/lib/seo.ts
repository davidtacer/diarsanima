import "server-only";
import type { Metadata } from "next";
import { BUILD_UPDATED_AT } from "@/config/build";
import type { Page } from "@/schema/page";
import type { Site } from "@/schema/site";
import { getBaseSite, getPage, hrefFor, listPages } from "./content";
import { sizeOf, srcOf } from "./images";

/** Produkcija: Cloudflare gradi vejo main (CF_PAGES_BRANCH) ali lokalno NEXT_PUBLIC_ENV=production. */
export const isProduction = () =>
  process.env.CF_PAGES_BRANCH ? process.env.CF_PAGES_BRANCH === "main" : process.env.NEXT_PUBLIC_ENV === "production";

const abs = (site: Site, path: string) => new URL(path, site.url).toString();

/** Prva slika strani (za Open Graph), sicer veliki logotip. */
function pageImage(page: Page, site: Site) {
  if (page.seo.image) return page.seo.image;
  for (const b of page.blocks) {
    if (b.type === "gallery") return b.groups[0].works[0].image;
    if (b.type === "text" && b.image) return b.image;
    if (b.type === "shatterMenu") return b.portrait;
    if (b.type === "glitchIntro") return b.background;
  }
  return site.brand.logoLarge;
}

export function pageMetadata(page: Page, site: Site, lang: string): Metadata {
  const base = getBaseSite();
  const languages = Object.fromEntries(base.languages.map((l) => [l, hrefFor(l, page.slug)]));
  const description = page.seo.description ?? site.seo.defaultDescription;
  const img = pageImage(page, site);
  const ogSrc = srcOf(img, 1280);
  const dims = sizeOf(ogSrc);
  return {
    title: page.slug === "index" ? { absolute: page.title } : page.title,
    description,
    authors: [{ name: site.name, url: site.url }],
    alternates: { canonical: hrefFor(lang, page.slug), languages: base.languages.length > 1 ? languages : undefined },
    openGraph: {
      title: page.title,
      description,
      siteName: site.name,
      url: hrefFor(lang, page.slug),
      images: [{ url: ogSrc, alt: img.alt, width: dims?.width, height: dims?.height }],
      locale: lang,
      type: page.slug === "about-artist" ? "profile" : "website",
    },
    twitter: { card: "summary_large_image", title: page.title, description, images: [ogSrc] },
    robots: isProduction() ? undefined : { index: false, follow: false },
  };
}

/** Ustanove, kjer je umetnica študirala (iz bloka logos), za alumniOf. */
function schools(lang: string) {
  for (const slug of listPages()) {
    const p = getPage(lang, slug);
    for (const b of p?.blocks ?? []) if (b.type === "logos") return b.items.map((i) => ({ "@type": "EducationalOrganization", name: i.image.alt }));
  }
  return [];
}

/** JSON-LD: spletna stran, umetnica (Person), drobtinice in dela iz galerij. */
export function jsonLd(page: Page, site: Site, lang: string) {
  const url = (p: string) => abs(site, hrefFor(lang, p));
  const personId = `${site.url}/#artist`;
  const person = {
    "@type": site.seo.schemaType,
    "@id": personId,
    name: site.name,
    url: site.url,
    description: site.seo.defaultDescription,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.seo.schemaType === "Person"
      ? { jobTitle: site.person.jobTitle, knowsAbout: site.person.knowsAbout, alumniOf: schools(lang) }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressCountry: site.contact.address.country,
      ...(site.contact.address.street ? { streetAddress: site.contact.address.street } : {}),
      ...(site.contact.address.postalCode ? { postalCode: site.contact.address.postalCode } : {}),
    },
    image: abs(site, srcOf(site.brand.logoLarge, 1280)),
    sameAs: site.social.map((s) => s.url),
  };
  const graph: object[] = [
    { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, description: site.tagline, inLanguage: lang, publisher: { "@id": personId } },
    person,
  ];

  // drobtinice (razen domače strani)
  if (page.slug !== "index") {
    const trail = [{ name: site.name, item: url("index") }];
    if (page.navParent) {
      const parent = getPage(lang, page.navParent);
      if (parent) trail.push({ name: parent.title, item: url(parent.slug) });
    }
    trail.push({ name: page.title, item: url(page.slug) });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.item })),
    });
  }

  if (page.slug === "about-artist")
    graph.push({ "@type": "ProfilePage", url: url(page.slug), name: page.title, mainEntity: { "@id": personId }, dateModified: BUILD_UPDATED_AT });

  const works = page.blocks.flatMap((b) => (b.type === "gallery" ? b.groups.flatMap((g) => g.works) : []));
  if (works.length)
    graph.push({
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
          image: abs(site, srcOf(w.image, 1280)),
          creator: { "@id": personId },
        },
      })),
    });

  return { "@context": "https://schema.org", "@graph": graph };
}

export function sitemapEntries() {
  const base = getBaseSite();
  return listPages().flatMap((slug) =>
    base.languages.map((lang) => {
      const page = getPage(lang, slug);
      const images = (page?.blocks ?? []).flatMap((b) =>
        b.type === "gallery" ? b.groups.flatMap((g) => g.works.map((w) => abs(base, srcOf(w.image, 1280)))) : [],
      );
      return {
        url: abs(base, hrefFor(lang, slug)),
        lastModified: BUILD_UPDATED_AT,
        ...(images.length ? { images } : {}),
        alternates:
          base.languages.length > 1
            ? { languages: Object.fromEntries(base.languages.map((l) => [l, abs(base, hrefFor(l, slug))])) }
            : undefined,
      };
    }),
  );
}

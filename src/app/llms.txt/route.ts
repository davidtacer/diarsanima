import { getBaseSite, getPage, hrefFor, listPages } from "@/lib/content";

export const dynamic = "force-static";

/** Kratek povzetek za AI iskalnike, generiran iz vsebine. */
export function GET() {
  const site = getBaseSite();
  const lang = site.defaultLanguage;
  const pages = listPages().map((slug) => getPage(lang, slug)!).filter(Boolean);
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.tagline}`,
    "",
    `${site.person.jobTitle}, ${site.contact.address.city}, ${site.contact.address.country}.`,
    site.person.knowsAbout.length ? `Focus: ${site.person.knowsAbout.join(", ")}.` : "",
    "",
    "## Pages",
    ...pages.map((p) => `- [${p.title}](${new URL(hrefFor(lang, p.slug), site.url)})${p.seo.description ? `: ${p.seo.description}` : ""}`),
    "",
    "## Works",
    ...pages.flatMap((p) =>
      p.blocks.flatMap((b) => (b.type === "gallery" ? b.groups.flatMap((g) => g.works.map((w) => `- ${w.title} (${p.title}): ${w.details}`)) : [])),
    ),
    "",
    "## Contact",
    `- Email: ${site.contact.email}`,
    ...(site.contact.phone ? [`- Phone: ${site.contact.phone}`] : []),
    ...site.social.map((s) => `- ${s.type}: ${s.url}`),
    "",
  ];
  return new Response(lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

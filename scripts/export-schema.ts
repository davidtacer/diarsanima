/**
 * yarn schema – content/schema.json: what the Inženirji.si editor may write (inzenirji-widget
 * docs/guides/site-contract.md §3, ADR-013). The editor reads it from the branch on every edit, gives it to the AI and
 * validates every write with it; the site build validates the same content again with zod (scripts/validate.ts).
 * Compact JSON: it goes into the model's prompt with every edit. CI fails when the committed file is out of date.
 */
import fs from "node:fs";
import path from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { meta as cards } from "../src/blocks/Cards/meta";
import { meta as catalogue } from "../src/blocks/Catalogue/meta";
import { meta as contact } from "../src/blocks/Contact/meta";
import { meta as cta } from "../src/blocks/Cta/meta";
import { meta as gallery } from "../src/blocks/Gallery/meta";
import { meta as glitchIntro } from "../src/blocks/GlitchIntro/meta";
import { meta as logos } from "../src/blocks/Logos/meta";
import { meta as notice } from "../src/blocks/Notice/meta";
import { meta as pageHeading } from "../src/blocks/PageHeading/meta";
import { meta as shatterMenu } from "../src/blocks/ShatterMenu/meta";
import { meta as textBlock } from "../src/blocks/Text/meta";
import { blockSchemas } from "../src/blocks/schemas";
import { pageSchema } from "../src/schema/page";
import { siteSchema } from "../src/schema/site";

/** Rules for the editing agent (the editor does not read CLAUDE.md). At most 4000 characters. */
const NOTES = [
  "Site of DiArsanima (DiA), a multidisciplinary visual artist from Maribor: portraits and archetypes (oil, acrylic, mixed media), digital collages and digital paintings, murals on commission. The site is her online catalogue for art lovers, collectors and clients.",
  "Language: English only. Calm, almost ritual tone, never salesy. Short sentences, no exclamation marks (exception: \"Got a project? Let's talk!\"). The artist in the third person (\"her artwork\"); first person only where she speaks herself (\"Services I Craft for My Clients\").",
  "Terms: \"artwork\"/\"works\" (not products/items), \"commission\" (not order), \"mural\" (not wall painting) in headings. Name always DiArsanima (capital A) or DiA. Brand words (mythical, archetype, ritual, fusion, portraiture, heritage) only where true.",
  "A work's caption: NUMBER + TITLE (capital letters) + details like \"100×80 cm, Oil on Canvas, Maribor 2023\". Numbers are her own numbering, not the order: never change names or numbers of works unless asked.",
  "New work: add it to the gallery block of its page (paintings, digital-artwork, murals); id = title in kebab-case (lady-of-the-dawn). To show it in the catalogue on page artwork, also add { page, work } to plates or feature of that group. Never change the id of a work used in the catalogue.",
  "Address blocks and list items by id, never by index; every block and list item keeps a stable kebab-case id. Never change id or type of existing blocks.",
  "Do not change without an explicit request: the catalogue intro on artwork (her official text), the structure of pages index and home, brand images in site.json (logo, seal, watermark, signature), url, theme, languages, defaultLanguage.",
  "Contact (e-mail, phone, city) lives only in site.json → contact; blocks read it from there. The footer year is computed; the Inženirji.si footer signature is code, not content.",
  "Images: only local /uploads/… with a descriptive English alt (at least 3 characters). Text: limited Markdown (paragraphs, **bold**, *italic*, lists, links page:slug, https://…, mailto:…), no HTML, no headings in text. Links open in a new tab by themselves; never add that by hand.",
  "seo.description at most 160 characters. Never invent facts (prices, exhibitions, awards, clients, quotes). No foreign logos, no personal data without consent. Deleting a page or more than one block needs the client's explicit confirmation.",
  "What the schema does not allow (new block types, colours, fonts, layout, new language, shop or payments): tell the client that Inženirji.si will do it.",
].join("\n");

// zod-to-json-schema writes draft-07 without $refs; the keywords used are the same in draft 2020-12 (the editor's
// validator). "$schema" is dropped so the editor applies its own draft.
const toSchema = (s: Parameters<typeof zodToJsonSchema>[0]) => {
  const out = zodToJsonSchema(s, { $refStrategy: "none" }) as Record<string, unknown>;
  delete out.$schema;
  return out;
};

const site = toSchema(siteSchema);
// Fields the client does not change (the agent sees readOnly; the build would still accept a change).
const props = site.properties as Record<string, Record<string, unknown>>;
for (const key of ["url", "defaultLanguage", "languages", "theme", "brand"]) if (props[key]) props[key].readOnly = true;

const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "site.json"), "utf8")) as { languages: string[]; defaultLanguage: string };
const others = content.languages.filter((l) => l !== content.defaultLanguage);
// The page schema in code checks blocks with a generic object + superRefine (per type); for the editor every block
// type is spelled out, with its description, so the agent and the validator see the real fields.
const metas: Record<string, { description?: string; whenToUse?: string }> = { glitchIntro, shatterMenu, catalogue, gallery, pageHeading, text: textBlock, cards, contact, cta, notice, logos };
const page = toSchema(pageSchema);
const pageProps = page.properties as Record<string, Record<string, unknown>>;
pageProps.blocks = {
  ...pageProps.blocks,
  items: {
    anyOf: Object.entries(blockSchemas).map(([type, schema]) => {
      const m = metas[type];
      const description = [m?.description, m?.whenToUse && `Kdaj: ${m.whenToUse}`].filter(Boolean).join(" ");
      return { ...toSchema(schema), ...(description ? { description } : {}) };
    }),
  },
};
const schema = {
  version: 1,
  notes: NOTES,
  uploads: { dir: "public/uploads", publicPath: "/uploads" },
  defaultLanguage: content.defaultLanguage,
  site,
  page,
  // Translations here are whole files (content/i18n/<lang>/…) with the same schemas as the default language.
  ...(others.length ? { translations: { languages: others, site, page } } : {}),
};

if (NOTES.length > 4000) throw new Error(`notes: ${NOTES.length} characters (max 4000)`);
const text = JSON.stringify(schema) + "\n";
if (Buffer.byteLength(text) > 200_000) throw new Error(`content/schema.json: ${Buffer.byteLength(text)} bytes (max 200 000)`);
const file = path.join(process.cwd(), "content", "schema.json");
if (process.argv.includes("--check")) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (cur !== text) {
    console.error("content/schema.json is out of date: run yarn schema and commit it");
    process.exit(1);
  }
  console.log("✓ content/schema.json is up to date");
} else {
  fs.writeFileSync(file, text);
  console.log(`✓ content/schema.json (${Math.round(Buffer.byteLength(text) / 1024)} kB)`);
}

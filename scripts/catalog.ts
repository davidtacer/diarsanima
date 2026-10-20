/**
 * Izvozi katalog blokov (JSON Schema + opis za AI) v src/schema/catalog.json.
 * Bere ga orodje list_blocks v urejevalniku. Po vsaki spremembi blokov poženi in commitaj.
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
import { meta as notice } from "../src/blocks/Notice/meta";
import { meta as pageHeading } from "../src/blocks/PageHeading/meta";
import { meta as shatterMenu } from "../src/blocks/ShatterMenu/meta";
import { meta as text } from "../src/blocks/Text/meta";
import { blockSchemas } from "../src/blocks/schemas";
import { siteSchema } from "../src/schema/site";

const metas = { glitchIntro, shatterMenu, catalogue, gallery, pageHeading, text, cards, contact, cta, notice };

const catalog = {
  generated: "yarn catalog",
  site: zodToJsonSchema(siteSchema, { $refStrategy: "none" }),
  blocks: Object.entries(blockSchemas).map(([type, schema]) => {
    const meta = metas[type as keyof typeof metas];
    const r = schema.safeParse(meta.example);
    if (!r.success) throw new Error(`Primer bloka ${type} ni veljaven: ${r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    return { ...meta, schema: zodToJsonSchema(schema, { $refStrategy: "none" }) };
  }),
};

const out = path.join(process.cwd(), "src/schema/catalog.json");
fs.writeFileSync(out, JSON.stringify(catalog, null, 2) + "\n");
console.log(`✓ ${catalog.blocks.length} blokov → ${path.relative(process.cwd(), out)}`);

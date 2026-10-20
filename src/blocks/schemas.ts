import { z } from "zod";
import { cardsSchema } from "./Cards/schema";
import { catalogueSchema } from "./Catalogue/schema";
import { contactSchema } from "./Contact/schema";
import { ctaSchema } from "./Cta/schema";
import { gallerySchema } from "./Gallery/schema";
import { glitchIntroSchema } from "./GlitchIntro/schema";
import { logosSchema } from "./Logos/schema";
import { noticeSchema } from "./Notice/schema";
import { pageHeadingSchema } from "./PageHeading/schema";
import { shatterMenuSchema } from "./ShatterMenu/schema";
import { textSchema } from "./Text/schema";

/**
 * Sheme vseh blokov brez komponent (za validate/catalog, ki tečeta zunaj Reacta).
 * notice ima .refine(), zato ni v discriminatedUnion; preverjamo ga po tipu.
 */
export const blockSchemas = {
  glitchIntro: glitchIntroSchema,
  shatterMenu: shatterMenuSchema,
  catalogue: catalogueSchema,
  gallery: gallerySchema,
  pageHeading: pageHeadingSchema,
  text: textSchema,
  cards: cardsSchema,
  contact: contactSchema,
  cta: ctaSchema,
  notice: noticeSchema,
  logos: logosSchema,
} as const;

export type BlockType = keyof typeof blockSchemas;
export type Block = { [K in BlockType]: z.infer<(typeof blockSchemas)[K]> }[BlockType];

export const blockSchema = z
  .object({ type: z.enum(Object.keys(blockSchemas) as [BlockType, ...BlockType[]]) })
  .passthrough()
  .superRefine((b, ctx) => {
    const r = blockSchemas[b.type].safeParse(b);
    if (!r.success) for (const i of r.error.issues) ctx.addIssue({ ...i, path: i.path } as z.IssueData);
  })
  .transform((b) => blockSchemas[b.type].parse(b) as Block);

import { z } from "zod";
import { id, pageRef, richText, shortText, workRef } from "@/schema/common";

export const catalogueSchema = z
  .object({
    id,
    type: z.literal("catalogue"),
    heading: z.object({ upright: shortText(12), italic: shortText(12) }).strict(),
    eyebrow: shortText(40),
    facts: z.array(z.object({ id, label: shortText(16), value: shortText(80) }).strict()).max(6).default([]),
    intro: richText(700),
    showSignature: z.boolean().default(true),
    subLeft: shortText(60).optional(),
    subRight: shortText(60).optional(),
    sections: z
      .array(
        z
          .object({
            id,
            numeral: shortText(6),
            title: shortText(24),
            page: pageRef,
            meta: z.array(shortText(32)).max(3).default([]),
            note: shortText(60).optional(),
            plates: z.array(workRef).min(1).max(6),
            feature: workRef.optional(),
          })
          .strict(),
      )
      .min(1)
      .max(6),
    commission: z
      .object({
        text: shortText(70),
        sub: shortText(80).optional(),
        sealText: shortText(70),
        sealLabel: shortText(80),
        page: pageRef,
      })
      .strict()
      .optional(),
  })
  .strict();
export type CatalogueBlock = z.infer<typeof catalogueSchema>;

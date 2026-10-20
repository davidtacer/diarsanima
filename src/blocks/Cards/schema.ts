import { z } from "zod";
import { id, image, longText, pageRef, shortText } from "@/schema/common";

export const cardsSchema = z
  .object({
    id,
    type: z.literal("cards"),
    heading: shortText(80).optional(),
    lead: shortText(160).optional(),
    items: z
      .array(
        z
          .object({
            id,
            title: shortText(60),
            image,
            description: longText(300).optional(),
            page: pageRef.optional(),
          })
          .strict(),
      )
      .min(1)
      .max(12),
  })
  .strict();
export type CardsBlock = z.infer<typeof cardsSchema>;

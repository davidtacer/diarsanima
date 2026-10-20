import { z } from "zod";
import { id, image, richText, shortText } from "@/schema/common";

export const textSchema = z
  .object({
    id,
    type: z.literal("text"),
    heading: shortText(80).optional(),
    body: richText(4000),
    variant: z.enum(["lead", "body"]).default("body"),
    /** Neobvezna slika ob besedilu. */
    image: image.optional(),
    imageSide: z.enum(["left", "right"]).default("right"),
    /** Pod besedilom izriše podpis umetnice (site.json → brand.signature). */
    showSignature: z.boolean().default(false),
  })
  .strict();
export type TextBlock = z.infer<typeof textSchema>;

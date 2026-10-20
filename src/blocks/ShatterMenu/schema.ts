import { z } from "zod";
import { id, image, pageRef, shortText } from "@/schema/common";

export const shatterMenuSchema = z
  .object({
    id,
    type: z.literal("shatterMenu"),
    heading: shortText(120),
    portrait: image,
    exploreLabel: shortText(14),
    links: z
      .array(z.object({ id, label: shortText(22), page: pageRef }).strict())
      .min(1)
      .max(6),
  })
  .strict();
export type ShatterMenuBlock = z.infer<typeof shatterMenuSchema>;

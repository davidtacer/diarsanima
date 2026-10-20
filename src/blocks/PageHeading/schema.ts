import { z } from "zod";
import { id, richText, shortText } from "@/schema/common";

export const pageHeadingSchema = z
  .object({
    id,
    type: z.literal("pageHeading"),
    heading: shortText(40),
    numeral: shortText(6).optional(),
    lead: richText(500).optional(),
  })
  .strict();
export type PageHeadingBlock = z.infer<typeof pageHeadingSchema>;

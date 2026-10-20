import { z } from "zod";
import { id, richText, shortText } from "@/schema/common";

export const textSchema = z
  .object({
    id,
    type: z.literal("text"),
    heading: shortText(80).optional(),
    body: richText(4000),
    variant: z.enum(["lead", "body"]).default("body"),
  })
  .strict();
export type TextBlock = z.infer<typeof textSchema>;

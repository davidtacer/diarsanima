import { z } from "zod";
import { id, shortText } from "@/schema/common";

export const contactSchema = z
  .object({
    id,
    type: z.literal("contact"),
    heading: shortText(60),
    sub: shortText(80).optional(),
  })
  .strict();
export type ContactBlock = z.infer<typeof contactSchema>;

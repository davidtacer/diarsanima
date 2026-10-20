import { z } from "zod";
import { id, image, shortText } from "@/schema/common";

export const contactSchema = z
  .object({
    id,
    type: z.literal("contact"),
    heading: shortText(60),
    sub: shortText(80).optional(),
    /** Neobvezna linijska ilustracija (bela na prosojnem), na platnu se izriše temno. */
    illustration: image.optional(),
  })
  .strict();
export type ContactBlock = z.infer<typeof contactSchema>;

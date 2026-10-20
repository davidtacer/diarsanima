import { z } from "zod";
import { id, pageRef, shortText } from "@/schema/common";

export const ctaSchema = z
  .object({
    id,
    type: z.literal("cta"),
    text: shortText(70),
    sub: shortText(80).optional(),
    sealText: shortText(70),
    sealLabel: shortText(80),
    page: pageRef,
  })
  .strict();
export type CtaBlock = z.infer<typeof ctaSchema>;

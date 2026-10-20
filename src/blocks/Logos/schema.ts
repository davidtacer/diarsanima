import { z } from "zod";
import { id, image, shortText } from "@/schema/common";

export const logosSchema = z
  .object({
    id,
    type: z.literal("logos"),
    heading: shortText(80).optional(),
    items: z
      .array(
        z
          .object({
            id,
            image,
            url: z.string().url().regex(/^https:\/\//).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(16),
  })
  .strict();
export type LogosBlock = z.infer<typeof logosSchema>;

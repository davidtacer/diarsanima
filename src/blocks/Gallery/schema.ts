import { z } from "zod";
import { id, image, shortText } from "@/schema/common";

export const workSchema = z
  .object({
    id,
    number: shortText(6),
    title: shortText(60),
    details: shortText(160),
    image,
  })
  .strict();

export const gallerySchema = z
  .object({
    id,
    type: z.literal("gallery"),
    groups: z
      .array(
        z
          .object({
            id,
            label: shortText(80).optional(),
            works: z.array(workSchema).min(1).max(60),
          })
          .strict(),
      )
      .min(1)
      .max(4),
  })
  .strict();
export type GalleryBlock = z.infer<typeof gallerySchema>;
export type Work = z.infer<typeof workSchema>;

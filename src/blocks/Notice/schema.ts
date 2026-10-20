import { z } from "zod";
import { id, pageRef, shortText, validity } from "@/schema/common";

export const noticeSchema = z
  .object({
    id,
    type: z.literal("notice"),
    text: shortText(160),
    link: z
      .object({ label: shortText(30), page: pageRef })
      .strict()
      .optional(),
    variant: z.enum(["quiet", "accent"]).default("quiet"),
    ...validity,
  })
  .strict()
  .refine((b) => !b.validFrom || !b.validUntil || b.validFrom <= b.validUntil, {
    message: "validFrom mora biti pred validUntil",
    path: ["validUntil"],
  });
export type NoticeBlock = z.infer<typeof noticeSchema>;

import { z } from "zod";
import { id, image, pageRef, shortText } from "@/schema/common";

export const glitchIntroSchema = z
  .object({
    id,
    type: z.literal("glitchIntro"),
    heading: shortText(120),
    background: image,
    tiger: image,
    tigerMobile: image,
    exploreLabel: shortText(24),
    explorePage: pageRef,
  })
  .strict();
export type GlitchIntroBlock = z.infer<typeof glitchIntroSchema>;

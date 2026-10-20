import { z } from "zod";
import { blockSchema } from "@/blocks/schemas";
import { image, pageRef, shortText, slug } from "./common";

export const pageSchema = z
  .object({
    slug,
    title: shortText(80),
    /** intro: brez glave in noge · stage: celozaslonski, noga čez sliko · paper: podstran v temi Platno */
    layout: z.enum(["intro", "stage", "paper"]).default("paper"),
    /** Katera točka menija je označena (npr. podstran sklopa → artwork). */
    navParent: pageRef.optional(),
    seo: z.object({ description: shortText(160).optional(), image: image.optional() }).strict().default({}),
    blocks: z.array(blockSchema).min(1).max(40),
  })
  .strict();

export type Page = z.infer<typeof pageSchema>;

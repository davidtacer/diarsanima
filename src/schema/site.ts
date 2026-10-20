import { z } from "zod";
import { id, image, pageRef, shortText, slug } from "./common";

const lang = z.string().regex(/^[a-z]{2}$/, "jezik je dvočrkovna koda (en, sl, de …)");

export const siteSchema = z
  .object({
    name: shortText(60),
    tagline: shortText(120),
    url: z.string().url().regex(/^https:\/\//),
    defaultLanguage: lang,
    languages: z.array(lang).min(1).max(6),
    person: z
      .object({
        jobTitle: shortText(80),
        knowsAbout: z.array(shortText(60)).max(10).default([]),
      })
      .strict(),
    contact: z
      .object({
        email: z.string().email(),
        phone: shortText(30).optional(),
        address: z
          .object({
            street: shortText(80).optional(),
            postalCode: shortText(12).optional(),
            city: shortText(60),
            country: z.string().regex(/^[A-Z]{2}$/),
          })
          .strict(),
      })
      .strict(),
    navigation: z.array(z.object({ id, label: shortText(30), page: pageRef }).strict()).min(1).max(8),
    social: z.array(z.object({ id, type: z.enum(["instagram", "facebook"]), url: z.string().url() }).strict()).max(6),
    brand: z
      .object({
        logo: image,
        logoLarge: image,
        seal: image,
        watermark: image,
        signature: image,
      })
      .strict(),
    seo: z
      .object({
        titleTemplate: shortText(80).refine((s) => s.includes("%s"), "titleTemplate mora vsebovati %s"),
        defaultDescription: shortText(160),
        schemaType: z.enum(["Person", "ArtGallery", "LocalBusiness"]).default("Person"),
      })
      .strict(),
    theme: z.object({ preset: z.enum(["diarsanima"]) }).strict(),
    ui: z
      .object({
        back: shortText(20),
        enter: shortText(20),
        skipToContent: shortText(40),
        language: shortText(20),
        notFoundHome: shortText(40),
      })
      .strict(),
  })
  .strict()
  .superRefine((s, ctx) => {
    if (!s.languages.includes(s.defaultLanguage))
      ctx.addIssue({ code: "custom", path: ["languages"], message: "defaultLanguage mora biti v languages" });
  });

export type Site = z.infer<typeof siteSchema>;
export { slug };

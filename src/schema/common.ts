import { z } from "zod";

/** Stabilen identifikator elementa (kebab-case). */
export const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id mora biti kebab-case (male črke, številke, vezaji)");

/** Slug strani: male črke, številke, vezaji, brez šumnikov. */
export const slug = z.string().regex(/^[a-z0-9-]+$/, "slug: samo male črke, številke in vezaji");

/** En odstavek brez prelomov. */
export const shortText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max, `največ ${max} znakov`)
    .refine((s) => !/[\r\n]/.test(s), "brez prelomov vrstic")
    .refine((s) => !/<[a-z/!]/i.test(s), "HTML ni dovoljen");

/** Daljše besedilo, dovoljeni prelomi (\n) — izriše se kot odstavki. */
export const longText = (max: number) =>
  z.string().trim().min(1).max(max, `največ ${max} znakov`).refine((s) => !/<[a-z/!]/i.test(s), "HTML ni dovoljen");

/**
 * Omejen Markdown: odstavki, **krepko**, *ležeče*, [povezava](page:slug | https://…), alineje (- ), oštevilčeni (1. ).
 * Brez naslovov, slik, HTML in tabel.
 */
export const richText = (max: number) =>
  longText(max)
    .refine((s) => !/^\s*#/m.test(s), "naslovi (#) niso dovoljeni, naslove dajo bloki")
    .refine((s) => !/!\[/.test(s), "slike v besedilu niso dovoljene")
    .refine((s) => !/^\s*\|/m.test(s), "tabele niso dovoljene")
    .refine(
      (s) => [...s.matchAll(/\]\(([^)]+)\)/g)].every((m) => /^(page:[a-z0-9-]+|https:\/\/\S+|mailto:\S+)$/.test(m[1])),
      "povezava mora biti page:slug, https://… ali mailto:…",
    );

/** Lokalna slika iz public/uploads. */
export const image = z
  .object({
    src: z
      .string()
      .regex(/^\/uploads\/[a-z0-9\-_./]+\.(jpg|jpeg|png|webp|avif|svg)$/, "slika mora biti v /uploads/ (male črke, brez presledkov)"),
    alt: shortText(150).pipe(z.string().min(3, "alt mora biti opisen (vsaj 3 znaki)")),
    focal: z.enum(["center", "top", "bottom", "left", "right"]).default("center"),
  })
  .strict();

/** Sklic na stran po slugu (povezava se zgradi v kodi). */
export const pageRef = slug;

/** Sklic na delo v bloku galerije druge strani. */
export const workRef = z.object({ page: pageRef, work: id }).strict();

/** Časovno omejena vsebina (ISO datumi). */
export const validity = {
  validFrom: z.string().date().optional(),
  validUntil: z.string().date().optional(),
};

export type Image = z.infer<typeof image>;
export type WorkRef = z.infer<typeof workRef>;

import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Image } from "@/schema/common";

const PUBLIC = path.join(process.cwd(), "public");
export const VARIANTS = [320, 640, 1280, 2400] as const;

const exists = (p: string) => fs.existsSync(path.join(PUBLIC, p));
const variantPath = (src: string, w: number) => src.replace(/\.(webp|png|jpe?g|avif)$/i, `-${w}.webp`);

/** Pot do najmanjše velikosti, ki je vsaj `width` široka (ali izvirnik). */
export function srcOf(image: Pick<Image, "src">, width: number): string {
  for (const w of VARIANTS) if (w >= width && exists(variantPath(image.src, w))) return variantPath(image.src, w);
  return image.src;
}

/** srcset iz obstoječih velikosti (-640, -1280, -2400) + izvirnika. */
export function srcSetOf(image: Pick<Image, "src">): string | undefined {
  const dims = sizeOf(image.src);
  const parts = VARIANTS.filter((w) => exists(variantPath(image.src, w))).map((w) => `${variantPath(image.src, w)} ${Math.min(w, dims?.width ?? w)}w`);
  if (dims) parts.push(`${image.src} ${dims.width}w`);
  return parts.length > 1 ? parts.join(", ") : undefined;
}

export function sizeOf(src: string): { width: number; height: number } | undefined {
  try {
    const d = imageSize(fs.readFileSync(path.join(PUBLIC, src)));
    return d.width && d.height ? { width: d.width, height: d.height } : undefined;
  } catch {
    return undefined;
  }
}

export const focalClass = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
} as const;

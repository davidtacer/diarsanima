import { focalClass, sizeOf, srcSetOf } from "@/lib/images";
import type { Image } from "@/schema/common";

/** Slika iz public/uploads s srcset, width/height in lazy nalaganjem (hero: priority). */
export default function UploadImage({
  image,
  sizes,
  className = "",
  priority = false,
  decorative = false,
}: {
  image: Image;
  sizes: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const dims = sizeOf(image.src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={srcSetOf(image)}
      sizes={sizes}
      width={dims?.width}
      height={dims?.height}
      alt={decorative ? "" : image.alt}
      aria-hidden={decorative || undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`${focalClass[image.focal ?? "center"]} ${className}`}
    />
  );
}

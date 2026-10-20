import UploadImage from "@/components/UploadImage";
import type { BlockProps } from "@/lib/types";
import type { GalleryBlock } from "./schema";

export default function Gallery({ block }: BlockProps<GalleryBlock>) {
  return (
    <div>
      {block.groups.map((g) => (
        <section key={g.id} className="mb-20" aria-label={g.label}>
          {g.label && (
            <p className="mb-6 text-xs uppercase tracking-[0.28em] text-gold">
              {g.label}
            </p>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-8 gap-y-12">
            {g.works.map((w) => (
              <figure key={w.id} id={w.id} className="group min-w-0">
                <div className="bg-paper-raised p-3 shadow-paper transition-[rotate,translate] duration-700 ease-shatter group-hover:-translate-y-1 group-odd:group-hover:rotate-1 group-even:group-hover:-rotate-1">
                  <UploadImage
                    image={w.image}
                    sizes="(max-width: 767px) 90vw, 260px"
                    className="aspect-[4/5] w-full bg-paper object-cover"
                  />
                </div>
                <figcaption className="mt-3 break-words">
                  <span className="font-display text-lg font-bold uppercase leading-tight">
                    <i className="mr-2 font-normal text-gold">{w.number}</i>
                    {w.title}
                  </span>
                  <span className="mt-1 block font-display text-sm italic text-char-soft">
                    {w.details}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

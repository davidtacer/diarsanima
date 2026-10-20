import UploadImage from "@/components/UploadImage";
import type { BlockProps } from "@/lib/types";
import type { CardsBlock } from "./schema";
import SmartLink from "@/components/SmartLink";

export default function Cards({ block, ctx }: BlockProps<CardsBlock>) {
  const hid = `${block.id}-heading`;
  return (
    <section
      aria-labelledby={block.heading ? hid : undefined}
      className="mb-[8vh]"
    >
      {block.heading && (
        <h2
          id={hid}
          className="mb-[2vh] font-display text-[clamp(28px,4vw,44px)] font-bold uppercase leading-none break-words"
        >
          {block.heading}
        </h2>
      )}
      {block.lead && (
        <p className="mb-[5vh] max-w-[62ch] font-display text-xl italic text-char-soft">
          {block.lead}
        </p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-7">
        {block.items.map((item) => {
          const body = (
            <>
              <div className="bg-paper-raised p-3 shadow-paper">
                <div className="overflow-hidden">
                  <UploadImage
                    image={item.image}
                    sizes="(max-width: 767px) 90vw, 320px"
                    className="aspect-[4/5] w-full object-cover transition-[scale] duration-700 ease-shatter group-hover:scale-103"
                  />
                </div>
              </div>
              <h3 className="mt-4 font-display text-[26px] font-bold uppercase leading-none break-words">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-2 whitespace-pre-line text-[15px] font-light leading-relaxed text-char-soft">
                  {item.description}
                </p>
              )}
            </>
          );
          return item.page ? (
            <SmartLink
              key={item.id}
              href={ctx.href(item.page)}
              className="group block min-w-0"
            >
              {body}
            </SmartLink>
          ) : (
            <div key={item.id} className="group min-w-0">
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

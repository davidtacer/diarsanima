import RichText from "@/components/RichText";
import UploadImage from "@/components/UploadImage";
import type { BlockProps } from "@/lib/types";
import type { TextBlock } from "./schema";

const variants = {
  lead: "text-[17px] font-light leading-[1.75] text-char-soft",
  body: "text-base font-light leading-[1.75] text-char",
} as const;

const sides = {
  right: { grid: "md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]", image: "md:order-2" },
  left: { grid: "md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]", image: "md:order-1" },
} as const;

export default function Text({ block, ctx }: BlockProps<TextBlock>) {
  const hid = `${block.id}-heading`;
  const body = (
    <div className="max-w-[62ch] min-w-0 md:order-1">
      {block.heading && (
        <h2 id={hid} className="mb-[2vh] font-display text-[clamp(28px,4vw,44px)] font-bold uppercase leading-none break-words">
          {block.heading}
        </h2>
      )}
      <RichText text={block.body} ctx={ctx} className={`${variants[block.variant]} [&_em]:font-display [&_em]:text-char`} />
      {block.showSignature && <UploadImage image={ctx.site.brand.signature} sizes="160px" className="mt-8 h-auto w-40" />}
    </div>
  );

  if (!block.image) {
    return (
      <section aria-labelledby={block.heading ? hid : undefined} className="mb-[6vh]">
        {body}
      </section>
    );
  }

  const side = sides[block.imageSide];
  return (
    <section
      aria-labelledby={block.heading ? hid : undefined}
      className={`mb-[10vh] grid items-center gap-x-16 gap-y-10 ${side.grid}`}
    >
      {body}
      <figure className={`min-w-0 ${side.image}`}>
        <div className={`bg-paper-raised p-3 shadow-paper ${block.imageSide === "right" ? "rotate-[1.5deg]" : "-rotate-[1.5deg]"} max-md:rotate-0`}>
          <UploadImage image={block.image} sizes="(max-width: 767px) 90vw, 520px" className="h-auto w-full" />
        </div>
      </figure>
    </section>
  );
}

import RichText from "@/components/RichText";
import type { BlockProps } from "@/lib/types";
import type { TextBlock } from "./schema";

const variants = {
  lead: "text-[17px] font-light leading-[1.75] text-char-soft",
  body: "text-base font-light leading-[1.75] text-char",
} as const;

export default function Text({ block, ctx }: BlockProps<TextBlock>) {
  const hid = `${block.id}-heading`;
  return (
    <section aria-labelledby={block.heading ? hid : undefined} className="mb-[6vh] max-w-[62ch]">
      {block.heading && (
        <h2 id={hid} className="mb-[2vh] font-display text-[clamp(28px,4vw,44px)] font-bold uppercase leading-none break-words">
          {block.heading}
        </h2>
      )}
      <RichText text={block.body} ctx={ctx} className={`${variants[block.variant]} [&_em]:font-display [&_em]:text-char`} />
    </section>
  );
}

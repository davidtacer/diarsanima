import RichText from "@/components/RichText";
import type { BlockProps } from "@/lib/types";
import type { PageHeadingBlock } from "./schema";

export default function PageHeading({
  block,
  ctx,
}: BlockProps<PageHeadingBlock>) {
  return (
    <div className="mb-[5vh]">
      <h1 className="border-b border-char pb-6 font-display text-[clamp(56px,9vw,128px)] font-black leading-[0.82] tracking-[-0.03em] break-words">
        {block.heading}
      </h1>
      {(block.numeral || block.lead) && (
        <div className="mt-6 flex max-w-[62ch] items-baseline gap-3">
          {block.numeral && (
            <span className="font-display text-2xl italic text-gold">
              {block.numeral}
            </span>
          )}
          {block.lead && (
            <RichText
              text={block.lead}
              ctx={ctx}
              className="text-[17px] font-light leading-[1.75] text-char-soft"
            />
          )}
        </div>
      )}
    </div>
  );
}

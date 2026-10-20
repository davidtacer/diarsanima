import Drips from "@/components/Drips";
import Seal from "@/components/Seal";
import { srcOf } from "@/lib/images";
import type { BlockProps } from "@/lib/types";
import type { CtaBlock } from "./schema";

export default function Cta({ block, ctx }: BlockProps<CtaBlock>) {
  return (
    <section className="grid grid-cols-[auto_1fr_auto] items-center gap-10 py-14 max-md:grid-cols-1 max-md:gap-6">
      <Drips className="h-[90px] w-[220px]" />
      <p className="max-w-[480px] font-display text-[26px] italic leading-[1.3] max-md:text-[22px]">
        {block.text}
        {block.sub && (
          <small className="mt-2.5 block font-sans text-[11px] not-italic uppercase tracking-[0.24em] text-char-soft">
            {block.sub}
          </small>
        )}
      </p>
      <Seal
        text={block.sealText}
        label={block.sealLabel}
        href={ctx.href(block.page)}
        image={srcOf(ctx.site.brand.seal, 640)}
      />
    </section>
  );
}

import type { BlockProps } from "@/lib/types";
import { srcOf } from "@/lib/images";
import type { ShatterMenuBlock } from "./schema";
import ShatterStage from "./ShatterStage";

export default function ShatterMenu({
  block,
  ctx,
}: BlockProps<ShatterMenuBlock>) {
  return (
    <ShatterStage
      heading={block.heading}
      portrait={srcOf(block.portrait, 1280)}
      logo={{
        src: srcOf(ctx.site.brand.logoLarge, 1280),
        alt: ctx.site.brand.logoLarge.alt,
      }}
      exploreLabel={block.exploreLabel}
      backLabel={ctx.site.ui.back}
      links={block.links.map((l) => ({
        id: l.id,
        label: l.label,
        href: ctx.href(l.page),
      }))}
    />
  );
}

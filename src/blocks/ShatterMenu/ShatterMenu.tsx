import type { BlockProps } from "@/lib/types";
import { preload } from "react-dom";
import { sizeOf, srcOf } from "@/lib/images";
import type { ShatterMenuBlock } from "./schema";
import ShatterStage from "./ShatterStage";

export default function ShatterMenu({
  block,
  ctx,
}: BlockProps<ShatterMenuBlock>) {
  const portrait = srcOf(block.portrait, 1280);
  const portraitMobile = srcOf(block.portrait, 640);
  const dims = sizeOf(block.portrait.src);
  // portret je LCP: prednaloži pravo velikost za telefon oziroma namizje z visoko prioriteto
  preload(portraitMobile, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  preload(portrait, { as: "image", fetchPriority: "high", media: "(min-width: 768px)" });
  // logotip nad portretom je pogosto največji izrisan element (LCP)
  preload(srcOf(ctx.site.brand.logoLarge, 640), { as: "image", fetchPriority: "high" });
  return (
    <ShatterStage
      heading={block.heading}
      portrait={portrait}
      portraitMobile={portraitMobile}
      ratio={dims ? Math.round((dims.width / dims.height) * 10000) / 10000 : 0.69}
      logo={{
        src: srcOf(ctx.site.brand.logoLarge, 640),
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

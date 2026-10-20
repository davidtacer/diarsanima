import type { BlockProps } from "@/lib/types";
import { srcOf } from "@/lib/images";
import type { GlitchIntroBlock } from "./schema";
import GlitchStage from "./GlitchStage";

export default function GlitchIntro({
  block,
  ctx,
}: BlockProps<GlitchIntroBlock>) {
  return (
    <GlitchStage
      heading={block.heading}
      background={srcOf(block.background, 2400)}
      tiger={{ src: srcOf(block.tiger, 2400), alt: block.tiger.alt }}
      tigerMobile={srcOf(block.tigerMobile, 1280)}
      logo={{
        src: srcOf(ctx.site.brand.logo, 640),
        alt: ctx.site.brand.logo.alt,
      }}
      explore={{ label: block.exploreLabel, href: ctx.href(block.explorePage) }}
    />
  );
}

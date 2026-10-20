import type { BlockProps } from "@/lib/types";
import { preload } from "react-dom";
import { srcOf, srcSetOf } from "@/lib/images";
import type { GlitchIntroBlock } from "./schema";
import GlitchStage from "./GlitchStage";

export default function GlitchIntro({
  block,
  ctx,
}: BlockProps<GlitchIntroBlock>) {
  const background = srcOf(block.background, 1280);
  const tigerSet = srcSetOf(block.tiger);
  const tigerMobileSet = srcSetOf(block.tigerMobile) ?? srcOf(block.tigerMobile, 1280);
  // tiger je LCP: prednaloži pravo različico za telefon oziroma namizje
  preload(srcOf(block.tigerMobile, 640), {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 767px)",
    imageSrcSet: tigerMobileSet,
    imageSizes: "42vh",
  });
  preload(srcOf(block.tiger, 1280), {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 768px)",
    imageSrcSet: tigerSet,
    imageSizes: "min(100vw, 190vh)",
  });
  preload(background, { as: "image" });
  return (
    <GlitchStage
      heading={block.heading}
      background={background}
      tiger={{ src: srcOf(block.tiger, 1280), srcSet: tigerSet, alt: block.tiger.alt }}
      tigerMobile={tigerMobileSet}
      logo={{
        src: srcOf(ctx.site.brand.logo, 640),
        alt: ctx.site.brand.logo.alt,
      }}
      explore={{ label: block.exploreLabel, href: ctx.href(block.explorePage) }}
    />
  );
}

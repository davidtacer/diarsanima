import Link from "next/link";
import Drips from "@/components/Drips";
import RichText from "@/components/RichText";
import Seal from "@/components/Seal";
import UploadImage from "@/components/UploadImage";
import { srcOf } from "@/lib/images";
import type { BlockProps } from "@/lib/types";
import CatalogueRows from "./CatalogueRows";
import type { CatalogueBlock } from "./schema";

export default function Catalogue({ block, ctx }: BlockProps<CatalogueBlock>) {
  const sections = block.sections.map((s) => {
    const feature = s.feature ? ctx.work(s.feature) : undefined;
    return {
      id: s.id,
      numeral: s.numeral,
      title: s.title,
      href: ctx.href(s.page),
      meta: s.meta,
      note: s.note,
      plates: s.plates.map((ref) => {
        const w = ctx.work(ref);
        return { id: `${ref.page}-${ref.work}`, src: srcOf(w.image, 640), alt: w.image.alt, caption: `${w.number} ${w.title}`, focal: w.image.focal };
      }),
      feature: feature && {
        src: srcOf(feature.image, 640),
        alt: feature.image.alt,
        caption: `${feature.number} ${feature.title}, ${feature.details}`,
        focal: feature.image.focal,
      },
    };
  });

  return (
    <section className="grid grid-cols-[300px_1fr] gap-[72px] px-[clamp(16px,4.5vw,64px)] pt-10 max-lg:grid-cols-[240px_1fr] max-lg:gap-10 max-md:flex max-md:flex-col max-md:gap-7 max-md:pt-4">
      {/* katalogni list */}
      <aside className="sticky top-10 self-start border-t border-char pt-[18px] max-md:static max-md:order-2">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">{block.eyebrow}</p>
        {block.facts.length > 0 && (
          <dl className="mt-[22px] grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2.5 text-xs">
            {block.facts.map((f) => (
              <div key={f.id} className="contents">
                <dt className="uppercase tracking-[0.2em] text-gold">{f.label}</dt>
                <dd className="break-words text-char-soft">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <RichText
          text={block.intro}
          ctx={ctx}
          className="mt-[30px] text-[15px] font-light leading-[1.75] text-char-soft [&_em]:font-display [&_em]:text-[17px] [&_em]:text-char"
        />
        {block.showSignature && <UploadImage image={ctx.site.brand.signature} sizes="96px" className="mt-6 h-auto w-24" />}
        <nav aria-label={block.eyebrow} className="mt-9 grid gap-2 border-t border-rule pt-4 text-xs uppercase tracking-[0.2em] text-char-soft max-md:hidden">
          {sections.map((s) => (
            <Link key={s.id} href={s.href} className="flex justify-between gap-4 transition-colors hover:text-rose">
              <span>{s.title}</span>
              <i className="font-display text-[13px] tracking-normal text-gold">{s.numeral}</i>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 max-md:contents">
        <div className="max-md:order-1">
          <h1 className="border-b border-char pb-7 font-display text-[clamp(88px,12.2vw,176px)] font-black leading-[0.8] tracking-[-0.04em] break-words">
            {block.heading.upright}
            <i className="font-normal">{block.heading.italic}</i>
          </h1>
          {(block.subLeft || block.subRight) && (
            <div className="flex justify-between gap-2 pb-1.5 pt-3.5 text-[11px] uppercase tracking-[0.24em] text-char-soft max-md:flex-col">
              {block.subLeft && <span>{block.subLeft}</span>}
              {block.subRight && <span className="max-md:hidden">{block.subRight}</span>}
            </div>
          )}
        </div>

        <div className="max-md:order-3">
          <CatalogueRows sections={sections} enterLabel={ctx.site.ui.enter} />

          {block.commission && (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-10 pb-[104px] pt-14 max-md:grid-cols-1 max-md:gap-6">
              <Drips className="h-[90px] w-[220px]" />
              <p className="max-w-[480px] font-display text-[26px] italic leading-[1.3] max-md:text-[22px]">
                {block.commission.text}
                {block.commission.sub && (
                  <small className="mt-2.5 block font-sans text-[11px] not-italic uppercase tracking-[0.24em] text-char-soft">
                    {block.commission.sub}
                  </small>
                )}
              </p>
              <Seal
                text={block.commission.sealText}
                label={block.commission.sealLabel}
                href={ctx.href(block.commission.page)}
                image={srcOf(ctx.site.brand.seal, 640)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

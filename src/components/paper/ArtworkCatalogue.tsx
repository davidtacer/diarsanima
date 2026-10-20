"use client";

import Link from "next/link";
import { useState } from "react";
import { wp, type Work } from "@/lib/works";

export type Section = {
  numeral: string;
  title: string;
  href: string;
  meta: string[];
  note: string;
  plates: Work[];
  feature: Work;
};

const caption = (w: Work) => `${w.no} ${w.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`;

/**
 * Kategorije kot vrstice muzejskega kataloga. Pod miško: naslov poševen in rožnat,
 * sličice dobijo barve, večje delo se "dvigne iz arhiva".
 */
export default function ArtworkCatalogue({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div onMouseLeave={() => setActive(null)}>
      {sections.map((s, i) => {
        const on = active === i;
        return (
          <Link
            key={s.href}
            href={s.href}
            data-on={on}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group/row relative grid grid-cols-[90px_1fr_220px] gap-x-6 gap-y-2 border-b border-rule py-9 outline-none max-md:grid-cols-[44px_1fr] max-md:gap-x-3 max-md:py-8"
          >
            {/* rožnata črta ob aktivni vrstici */}
            <span
              aria-hidden
              className="absolute -left-6 bottom-9 top-9 w-px origin-top scale-y-0 bg-rose transition-transform duration-700 ease-shatter group-data-[on=true]/row:scale-y-100 max-md:hidden"
            />

            <span className="pt-2.5 font-display text-[44px] italic leading-none text-gold transition-colors duration-500 group-data-[on=true]/row:text-rose max-md:pt-1 max-md:text-[28px]">
              {s.numeral}
            </span>

            <h2 className="font-display text-[clamp(44px,6.4vw,92px)] font-bold uppercase leading-[0.9] tracking-[-0.01em] transition-[color,font-weight] duration-500 group-data-[on=true]/row:font-normal group-data-[on=true]/row:italic group-data-[on=true]/row:text-rose group-focus-visible/row:underline">
              {s.title}
            </h2>

            <span className="pt-3 text-[11px] uppercase leading-[2] tracking-[0.24em] text-char-soft transition-opacity duration-300 group-data-[on=true]/row:opacity-0 max-md:col-start-2 max-md:pt-0 max-md:group-data-[on=true]/row:opacity-100">
              {s.meta.map((m) => (
                <span key={m} className="block">
                  {m}
                </span>
              ))}
              <b className="mt-2.5 block font-display text-[15px] font-normal normal-case italic leading-normal tracking-normal text-char">
                {s.note}
              </b>
            </span>

            {/* sličice */}
            <div className="col-[2/4] mt-5 flex items-end gap-3.5 max-md:col-[1/-1] max-md:-mx-1 max-md:overflow-x-auto max-md:px-1 max-md:pb-1">
              {s.plates.map((w) => (
                <figure key={w.src} className="w-24 shrink-0 max-md:w-[84px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wp(w.src)}
                    alt={w.title}
                    loading="lazy"
                    className="h-30 w-24 bg-paper-raised object-cover opacity-75 grayscale-100 sepia-[.35] transition-[filter,opacity] duration-700 group-data-[on=true]/row:opacity-100 group-data-[on=true]/row:grayscale-0 group-data-[on=true]/row:sepia-0 max-md:h-[104px] max-md:w-[84px] max-md:opacity-100 max-md:grayscale-0 max-md:sepia-0"
                  />
                  <figcaption className="mt-1.5 truncate font-display text-[11px] italic text-char-soft">{caption(w)}</figcaption>
                </figure>
              ))}
              <span className="mb-[22px] ml-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] transition-opacity group-data-[on=true]/row:opacity-0 max-md:hidden">
                <span className="grid size-10 place-items-center rounded-full border border-char tracking-normal">→</span>
                Enter
              </span>
            </div>

            {/* delo, ki se dvigne iz arhiva */}
            <figure
              aria-hidden
              className="pointer-events-none absolute right-0 top-6 z-20 w-[250px] translate-y-5 rotate-0 bg-paper-raised px-4 pb-3.5 pt-4 opacity-0 shadow-[0_24px_60px_rgba(40,30,20,0.25)] transition-[opacity,translate,rotate] duration-700 ease-shatter group-data-[on=true]/row:translate-y-0 group-data-[on=true]/row:rotate-3 group-data-[on=true]/row:opacity-100 max-lg:hidden"
            >
              <span className="absolute -top-[7px] left-1/2 size-3 -translate-x-1/2 rounded-full bg-ochre" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={wp(s.feature.src)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-2.5 font-display text-sm italic text-char-soft">
                {s.feature.no} {s.feature.title}, {s.feature.details}
              </figcaption>
            </figure>
          </Link>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import ArtworkCatalogue, { type Section } from "@/components/paper/ArtworkCatalogue";
import Drips from "@/components/paper/Drips";
import PaperShell from "@/components/paper/PaperShell";
import Seal from "@/components/paper/Seal";
import { digitalCollages, digitalPaintings, murals, paintings } from "@/lib/works";

export const metadata = { title: "Artwork – DiArsanima" };

const pick = <T extends { no: string }>(list: T[], nos: string[]) => nos.map((n) => list.find((w) => w.no === n)!);

const sections: Section[] = [
  {
    numeral: "I",
    title: "Paintings",
    href: "/portfolio/paintings",
    meta: ["oil on canvas", "acrylic · mixed media"],
    note: "portraits and archetypes",
    plates: pick(paintings, ["1", "3", "4", "5", "6"]),
    feature: pick(paintings, ["4"])[0],
  },
  {
    numeral: "II",
    title: "Digital Artwork",
    href: "/portfolio/digital-artwork",
    meta: ["digital collage", "digital painting"],
    note: "the archetype series",
    plates: [...pick(digitalCollages, ["9", "4", "2"]), ...pick(digitalPaintings, ["12", "6"])],
    feature: pick(digitalCollages, ["7"])[0],
  },
  {
    numeral: "III",
    title: "Murals",
    href: "/portfolio/murals",
    meta: ["walls · large scale", "commissions"],
    note: "Maribor · Kamnik · Mexico",
    plates: pick(murals, ["1", "2", "3", "4", "5"]),
    feature: pick(murals, ["3"])[0],
  },
];

const tocNumerals = ["I", "II", "III"];

export default function ArtworkPage() {
  return (
    <PaperShell active="/artwork">
      <section className="grid grid-cols-[300px_1fr] gap-[72px] px-[clamp(16px,4.5vw,64px)] pt-10 max-lg:grid-cols-[240px_1fr] max-lg:gap-10 max-md:flex max-md:flex-col max-md:gap-7 max-md:pt-4">
        {/* katalogni list (levo, ostane na mestu) */}
        <aside className="sticky top-10 self-start border-t border-char pt-[18px] max-md:static max-md:order-2">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Catalogue · vol. ii</p>
          <dl className="mt-[22px] grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2.5 text-xs">
            {[
              ["Artist", "DiArsanima (DiA)"],
              ["Based", "Maribor, Slovenia"],
              ["Media", "oil, acrylic, mixed media, digital collage, walls"],
              ["Sections", "three"],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="uppercase tracking-[0.2em] text-gold">{k}</dt>
                <dd className="text-char-soft">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-[30px] text-[15px] font-light leading-[1.75] text-char-soft">
            Welcome to the DiArsanima&rsquo;s online display of her artwork. Where{" "}
            <em className="font-display text-[17px] text-char">mythical creations</em> meet portraiture in different artistic
            mediums, formats and techniques. All based on the collective human archetypal heritage, approached by the artist
            through <em className="font-display text-[17px] text-char">contemporary ritual fusion process.</em>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/dia-podpis.png" alt="DiA" className="mt-6 w-24" />
          <nav className="mt-9 grid gap-2 border-t border-rule pt-4 text-xs uppercase tracking-[0.2em] text-char-soft max-md:hidden">
            {sections.map((s, i) => (
              <Link key={s.href} href={s.href} className="flex justify-between transition-colors hover:text-rose">
                <span>{s.title}</span>
                <i className="font-display text-[13px] tracking-normal text-gold">{tocNumerals[i]}</i>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 max-md:contents">
          <div className="max-md:order-1">
            <h1 className="border-b border-char pb-7 font-display text-[clamp(88px,12.2vw,176px)] font-black leading-[0.8] tracking-[-0.04em]">
              Art<i className="font-normal">work</i>
            </h1>
            <div className="flex justify-between gap-2 pb-1.5 pt-3.5 text-[11px] uppercase tracking-[0.24em] text-char-soft max-md:flex-col">
              <span>Three sections of one archive</span>
              <span className="max-md:hidden">Hover a title to lift a work</span>
            </div>
          </div>

          <div className="max-md:order-3">
            <ArtworkCatalogue sections={sections} />

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-10 pb-[104px] pt-14 max-md:grid-cols-1 max-md:gap-6">
              <Drips className="h-[90px] w-[220px]" />
              <p className="max-w-[480px] font-display text-[26px] italic leading-[1.3] max-md:text-[22px]">
                A portrait, a mural, an animal you love.
                <small className="mt-2.5 block font-sans text-[11px] not-italic uppercase tracking-[0.24em] text-char-soft">
                  Commission work · portraits · murals · animals
                </small>
              </p>
              <Seal />
            </div>
          </div>
        </div>
      </section>
    </PaperShell>
  );
}

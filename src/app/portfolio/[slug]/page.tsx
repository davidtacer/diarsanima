import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { Lead } from "@/components/ui";
import { digitalCollages, digitalPaintings, murals, paintings, wp, type Work } from "@/lib/works";

const groups: Record<string, { title: string; numeral: string; parts: { label?: string; works: Work[] }[] }> = {
  paintings: { title: "Paintings", numeral: "I", parts: [{ works: paintings }] },
  "digital-artwork": {
    title: "Digital Artwork",
    numeral: "II",
    parts: [
      { label: "Digital Collages", works: digitalCollages },
      { label: "Digital Paintings · the archetype series", works: digitalPaintings },
    ],
  },
  murals: { title: "Murals", numeral: "III", parts: [{ works: murals }] },
};

export function generateStaticParams() {
  return Object.keys(groups).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${groups[slug]?.title ?? "Artwork"} – DiArsanima` };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = groups[slug];
  if (!g) notFound();
  return (
    <PageShell title={g.title} active="/artwork">
      <Lead>
        <span className="mr-3 font-display text-2xl italic text-gold">{g.numeral}</span>
        TODO: kratek uvod v sklop (iz WP ali od umetnice).
      </Lead>
      {g.parts.map((p) => (
        <section key={p.label ?? "all"} className="mb-20">
          {p.label && <p className="mb-6 text-xs uppercase tracking-[0.28em] text-gold">{p.label}</p>}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-8 gap-y-12">
            {p.works.map((w) => (
              <figure key={w.src} className="group">
                <div className="bg-paper-raised p-3 shadow-[0_24px_60px_rgba(40,30,20,0.18)] transition-[rotate,translate] duration-700 ease-shatter group-hover:-translate-y-1 group-odd:group-hover:rotate-1 group-even:group-hover:-rotate-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={wp(w.src)} alt={w.title} loading="lazy" className="aspect-[4/5] w-full bg-paper object-cover" />
                </div>
                <figcaption className="mt-3">
                  <span className="font-display text-lg font-bold uppercase leading-tight">
                    <i className="mr-2 font-normal text-gold">{w.no}</i>
                    {w.title}
                  </span>
                  <span className="mt-1 block font-display text-sm italic text-char-soft">{w.details}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}

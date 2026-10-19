import PageShell from "@/components/PageShell";
import { Card, CardGrid, Lead } from "@/components/ui";
import { portfolio } from "@/lib/site";

export const metadata = { title: "Artwork – DiArsanima" };

export default function ArtworkPage() {
  return (
    <PageShell title="Artwork">
      {/* TODO: prenesi uvodno besedilo iz WP strani /artwork */}
      <Lead>Mythical creations meet portraiture across mediums, formats and techniques.</Lead>
      <CardGrid>
        {portfolio.map((p) => (
          <Card key={p.slug} title={p.title} image={p.image} href={`/portfolio/${p.slug}`} />
        ))}
      </CardGrid>
    </PageShell>
  );
}

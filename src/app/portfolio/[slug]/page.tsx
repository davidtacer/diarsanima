import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { Todo } from "@/components/ui";
import { portfolio } from "@/lib/site";

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = portfolio.find((p) => p.slug === slug);
  if (!item) notFound();
  return (
    <PageShell title={item.title}>
      <Todo>TODO: galerija del iz WP strani /portfolio/{slug}/</Todo>
    </PageShell>
  );
}

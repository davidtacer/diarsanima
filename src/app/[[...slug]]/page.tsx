import { notFound } from "next/navigation";
import RenderPage from "@/components/RenderPage";
import { getPage, getSite, makeContext } from "@/lib/content";
import { allRoutes, parseSlug } from "@/lib/routes";
import { jsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.segments }));
}

type Params = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Params) {
  const r = parseSlug((await params).slug);
  const page = r && getPage(r.lang, r.slug);
  if (!r || !page) return {};
  return pageMetadata(page, getSite(r.lang), r.lang);
}

export default async function Page({ params }: Params) {
  const r = parseSlug((await params).slug);
  const page = r && getPage(r.lang, r.slug);
  if (!r || !page) notFound();
  const ctx = makeContext(r.lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page, ctx.site, r.lang)).replace(/</g, "\\u003c") }} />
      <RenderPage page={page} ctx={ctx} />
    </>
  );
}

import { blocks } from "@/blocks/registry";
import type { BlockContext } from "@/lib/types";
import type { Page } from "@/schema/page";
import { LinkLabelsProvider } from "./LinkLabels";
import PaperLayout from "./PaperLayout";
import SiteFooter from "./SiteFooter";
import ValidityGuard from "./ValidityGuard";

/** Strani nimajo postavitve: samo zanka čez bloke in izris prek registra. */
export default function RenderPage({
  page,
  ctx,
}: {
  page: Page;
  ctx: BlockContext;
}) {
  const content = page.blocks.map((b) => {
    const entry = blocks[b.type];
    const Component = entry.Component as React.ComponentType<{
      block: typeof b;
      ctx: BlockContext;
    }>;
    return <Component key={b.id} block={b} ctx={ctx} />;
  });

  if (page.layout === "paper") {
    const wide = page.blocks.some((b) => b.type === "catalogue");
    return (
      <LinkLabelsProvider newTab={ctx.site.ui.newTab}>
        <PaperLayout
          ctx={ctx}
          active={page.navParent ?? page.slug}
          slug={page.slug}
        >
          {wide ? (
            content
          ) : (
            <div className="mx-auto w-full max-w-[1312px] animate-enter px-[clamp(16px,4.5vw,64px)] pb-[104px] pt-10">
              {content}
            </div>
          )}
          <ValidityGuard />
        </PaperLayout>
      </LinkLabelsProvider>
    );
  }
  return (
    <LinkLabelsProvider newTab={ctx.site.ui.newTab}>
      <main>{content}</main>
      {page.layout === "stage" && (
        <SiteFooter site={ctx.site} lang={ctx.lang} overlay />
      )}
      {/* intro (index) je brez noge in podpisa: izjema po Davidovi pisni odobritvi, 20. 10. 2026 */}
      <ValidityGuard />
    </LinkLabelsProvider>
  );
}

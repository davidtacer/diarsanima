import Link from "next/link";
import { srcOf } from "@/lib/images";
import type { BlockContext } from "@/lib/types";
import { hrefFor, getBaseSite } from "@/lib/content";
import SiteFooter from "./SiteFooter";
import MobileMenu from "./MobileMenu";
import UploadImage from "./UploadImage";

const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

/**
 * Postavitev podstrani (CGP tema "Platno"): platno, zrno, vodni žig, glava z rimsko oštevilčenim menijem.
 * Vse vsebine pridejo iz site.json.
 */
export default function PaperLayout({
  ctx,
  active,
  slug,
  children,
}: {
  ctx: BlockContext;
  active: string;
  slug: string;
  children: React.ReactNode;
}) {
  const { site } = ctx;
  const languages = getBaseSite().languages;
  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper text-char">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcOf(site.brand.watermark, 1280)}
        alt=""
        aria-hidden
        className="pointer-events-none fixed right-[2vw] top-[-4vh] z-0 h-[112vh] w-auto max-w-none -rotate-[7deg] opacity-[0.06] max-md:right-[-34vw] max-md:h-[80vh]"
      />
      <div aria-hidden className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.16] mix-blend-multiply" />

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:px-3 focus:py-2">
        {site.ui.skipToContent}
      </a>

      <header className="relative z-10 flex items-center justify-between gap-6 px-[clamp(16px,4.5vw,64px)] py-8 max-md:py-5">
        <Link href={ctx.href("index")}>
          <UploadImage image={site.brand.logo} sizes="150px" priority className="h-auto w-[150px] invert max-md:w-[124px]" />
        </Link>
        <nav className="flex flex-wrap gap-x-9 gap-y-3 text-xs uppercase tracking-[0.28em] max-md:hidden">
          {site.navigation.map((n, i) => {
            const on = n.page === active;
            return (
              <Link
                key={n.id}
                href={ctx.href(n.page)}
                aria-current={on ? "page" : undefined}
                className={`relative transition-colors hover:text-char ${on ? "text-char" : "text-char-soft"}`}
              >
                <sup className="mr-1.5 font-display text-[11px] italic tracking-normal text-gold">{roman[i]}</sup>
                {n.label}
                {on && (
                  <span aria-hidden className="absolute -top-[18px] left-1/2 -translate-x-1/2 text-[10px] tracking-normal text-ochre">
                    ✦
                  </span>
                )}
              </Link>
            );
          })}
          {/* preklop jezika: samodejno, ko je v site.languages več kot en jezik */}
          {languages.length > 1 && (
            <span aria-label={site.ui.language} className="flex gap-3">
              {languages.map((l) => (
                <Link
                  key={l}
                  href={hrefFor(l, slug)}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === ctx.lang ? "true" : undefined}
                  className={l === ctx.lang ? "text-char" : "text-char-soft hover:text-char"}
                >
                  {l}
                </Link>
              ))}
            </span>
          )}
        </nav>
        <MobileMenu
          menuLabel={site.ui.menu}
          closeLabel={site.ui.close}
          items={site.navigation.map((n, i) => ({
            id: n.id,
            label: n.label,
            href: ctx.href(n.page),
            numeral: roman[i].toUpperCase(),
            active: n.page === active,
          }))}
          languages={languages.map((l) => ({ code: l, href: hrefFor(l, slug), active: l === ctx.lang }))}
        />
      </header>

      <main id="main" className="relative z-10">
        {children}
      </main>
      <SiteFooter site={site} lang={ctx.lang} tone="paper" />
    </div>
  );
}

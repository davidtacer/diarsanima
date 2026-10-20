import Link from "next/link";
import { assets, mainNav } from "@/lib/site";
import SiteFooter from "../SiteFooter";

const roman = ["i", "ii", "iii", "iv"];

/**
 * Ovoj vseh podstrani (CGP tema "Platno"): svetlo platno, zrno, vodni žig artSidebar,
 * glava z rimsko oštevilčenim menijem (aktivna stran ima oranžno iskro ✦).
 */
export default function PaperShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper text-char">
      {/* vodni žig */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assets.artSidebar}
        alt=""
        aria-hidden
        className="pointer-events-none fixed right-[2vw] top-[-4vh] z-0 h-[112vh] w-auto max-w-none -rotate-[7deg] opacity-[0.06] max-md:right-[-34vw] max-md:h-[80vh]"
      />
      {/* zrno platna */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative z-10 flex items-center justify-between gap-6 px-[clamp(16px,4.5vw,64px)] py-8 max-md:flex-col max-md:items-start max-md:py-5">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assets.logoSmall} alt="DiArsanima" className="h-auto w-[150px] invert" />
        </Link>
        <nav className="flex flex-wrap gap-x-9 gap-y-3 text-xs uppercase tracking-[0.28em] max-md:gap-x-4 max-md:text-[10px]">
          {mainNav.map((n, i) => {
            const on = n.href === active;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`relative transition-colors hover:text-char ${on ? "text-char" : "text-char-soft"}`}
              >
                <sup className="mr-1.5 font-display text-[11px] italic tracking-normal text-gold">{roman[i]}</sup>
                {n.label}
                {on && (
                  <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 text-[10px] tracking-normal text-ochre">✦</span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="relative z-10">{children}</div>
      <SiteFooter tone="paper" />
    </div>
  );
}

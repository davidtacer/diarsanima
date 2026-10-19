import Link from "next/link";
import { assets, mainNav } from "@/lib/site";
import SiteFooter from "./SiteFooter";

export default function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(80px,14vw)_1fr] max-md:grid-cols-1">
      <aside
        className="sticky top-0 h-screen bg-cover bg-center max-md:hidden"
        style={{ backgroundImage: `url(${assets.artSidebar})` }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-6 px-[clamp(16px,5vw,64px)] py-6 max-md:flex-col max-md:items-start">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assets.logoSmall} alt="DiArsanima" className="h-auto w-[150px]" />
          </Link>
          <nav className="flex flex-wrap gap-[clamp(14px,2.5vw,36px)] text-xs uppercase tracking-[0.2em]">
            {mainNav.map((n) => (
              <Link key={n.href} href={n.href} className="opacity-75 transition-opacity hover:opacity-100">
                {n.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="w-full max-w-[1100px] flex-1 animate-enter px-[clamp(16px,5vw,64px)] pb-[8vh] pt-[4vh]">
          <h1 className="mb-[5vh] origin-bottom-left scale-y-125 font-display text-[clamp(40px,6vw,80px)] font-bold uppercase leading-none">
            {title}
          </h1>
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

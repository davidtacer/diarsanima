"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { assets, introExploreHref } from "@/lib/site";

const STRIPS = 6;

/**
 * Intro stran: ozadje počasi "diha", čez njega naključno švigajo vodoravni
 * glitch trakovi (izrezi iste slike, zamaknjeni levo/desno, včasih z RGB zamikom).
 */
export default function GlitchIntro() {
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const art = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    let alive = true;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const fireStrip = (el: HTMLDivElement) => {
      const top = rand(0, 96);
      const h = Math.random() < 0.7 ? rand(0.15, 1.2) : rand(1.5, 7);
      const shift = (Math.random() < 0.5 ? -1 : 1) * rand(8, 90);
      el.style.clipPath = `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`;
      el.style.transform = `translate3d(${shift}px,0,0)`;
      el.style.filter = Math.random() < 0.35 ? `hue-rotate(${rand(-60, 60)}deg) saturate(1.6)` : "none";
      el.dataset.rgb = String(Math.random() < 0.4);
      el.style.opacity = "1";
      timers.push(window.setTimeout(() => (el.style.opacity = "0"), rand(50, 220)));
    };

    const burst = () => {
      if (!alive) return;
      const n = Math.random() < 0.25 ? Math.ceil(rand(2, STRIPS)) : Math.ceil(rand(1, 2));
      const pool = strips.current.filter(Boolean) as HTMLDivElement[];
      pool.sort(() => Math.random() - 0.5).slice(0, n).forEach(fireStrip);
      if (n > 2 && art.current) {
        art.current.dataset.jolt = "true";
        timers.push(window.setTimeout(() => art.current && (art.current.dataset.jolt = "false"), 140));
      }
      timers.push(window.setTimeout(burst, Math.random() < 0.6 ? rand(60, 260) : rand(500, 1800)));
    };
    timers.push(window.setTimeout(burst, 600));

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const bg = { backgroundImage: `url(${assets.introBanner})` };
  const layer = "absolute inset-0 bg-cover bg-center";

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#1a0a1e]">
      {/* ozadje + trakovi v istem ovoju, da se med "dihanjem" ujemajo piksel na piksel */}
      <div className="absolute -inset-[2%] animate-breathe">
        <div className={layer} style={bg} />
        {Array.from({ length: STRIPS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              strips.current[i] = el;
            }}
            className={`${layer} opacity-0 will-change-[transform,clip-path] data-[rgb=true]:mix-blend-screen data-[rgb=true]:shadow-[inset_0_0_0_9999px_rgba(40,120,255,0.12)]`}
            style={bg}
            aria-hidden
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_40%,rgba(10,0,15,0.55)_100%)]" />

      {/* tiger: na sredini, čez skoraj cel zaslon */}
      <div
        ref={art}
        className="group pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="animate-float">
          <picture>
            <source media="(max-width: 767px)" srcSet={assets.tigerMobile} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assets.tigerFull}
              alt=""
              className="h-auto w-[min(100vw,190vh)] max-w-none drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] max-md:h-[94vh] max-md:w-auto group-data-[jolt=true]:translate-x-1.5 group-data-[jolt=true]:[filter:drop-shadow(-3px_0_0_rgba(255,0,80,0.6))_drop-shadow(3px_0_0_rgba(0,200,255,0.6))]"
            />
          </picture>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 animate-fade-blur flex-col items-center gap-3.5 max-md:top-[72%]">
        <h1 className="sr-only">DiArsanima – a showcase of mystical and human-inspired art.</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assets.logoSmall} alt="DiArsanima" className="h-auto w-[clamp(170px,15vw,260px)]" />
        <Link
          href={introExploreHref}
          className="relative py-1.5 pl-[0.32em] text-xs uppercase tracking-[0.32em] text-bone after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-400 hover:after:left-0 hover:after:w-full"
        >
          Explore?
        </Link>
      </div>
    </main>
  );
}

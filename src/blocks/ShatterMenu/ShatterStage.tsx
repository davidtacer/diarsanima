"use client";

import { useEffect, useMemo, useState } from "react";
import SmartLink from "@/components/SmartLink";

const COLS = 6;
const ROWS = 7;
const MAX_DELAY = 380; // ms

type Tile = {
  col: number;
  row: number;
  dx: number; // vw
  dy: number; // vh
  scale: number;
  dim: number; // motnost v razbitem stanju
  delay: number; // ms
  drift: number; // s
  ddx: number; // px
  ddy: number; // px
};

/** Deterministični PRNG, da sta SSR in klient enaka. */
function makeTiles(seed: number): Tile[] {
  let t = seed;
  const rnd = () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
  const tiles: Tile[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // smer: od središča slike navzven + šum
      const cx = (col + 0.5) / COLS - 0.5;
      const cy = (row + 0.5) / ROWS - 0.5;
      const spread = 0.8 + rnd() * 1.2;
      tiles.push({
        col,
        row,
        dx: cx * 90 * spread + (rnd() - 0.5) * 30,
        dy: cy * 80 * spread + (rnd() - 0.5) * 22,
        scale: 0.75 + rnd() * 0.35,
        dim: rnd() < 0.3 ? 0.55 + rnd() * 0.3 : 0.15 + rnd() * 0.3,
        delay: rnd() * MAX_DELAY,
        drift: 7 + rnd() * 8,
        ddx: (rnd() - 0.5) * 28,
        ddy: (rnd() - 0.5) * 28,
      });
    }
  }
  return tiles;
}

/**
 * /home: portret, ki se ob kliku na EXPLORE razbije na ploščice in razkrije meni.
 * BACK (ali Esc) ploščice sestavi nazaj v sliko.
 */
type Props = {
  heading: string;
  portrait: string;
  /** manjša različica portreta za telefon (ozadje ne more imeti srcset) */
  portraitMobile: string;
  /** razmerje širina/višina portreta (izračunano ob buildu) */
  ratio: number;
  logo: { src: string; alt: string };
  exploreLabel: string;
  backLabel: string;
  links: { id: string; label: string; href: string }[];
};

export default function ShatterStage({
  heading,
  portrait,
  portraitMobile,
  ratio,
  logo,
  exploreLabel,
  backLabel,
  links,
}: Props) {
  const [open, setOpen] = useState(false);
  const tiles = useMemo(() => makeTiles(7), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // "background-size: cover" za celoten okvir, razrezan na ploščice — samo s CSS (container query enote),
  // zato je portret viden takoj, brez čakanja na JavaScript.
  const coverW = `max(100cqw, calc(100cqh * ${ratio}))`;
  const coverH = `max(100cqh, calc(100cqw / ${ratio}))`;

  return (
    <div
      data-open={open}
      className="group fixed inset-0 overflow-hidden bg-ink"
    >
      <h1 className="sr-only">{heading}</h1>
      {/* okvir s portretom; logotip in gumb sta pozicionirana glede nanj */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative h-[70vh] [container-type:size] w-[min(44vw,640px)] animate-rise max-md:h-[58vh] max-md:w-[86vw]"
        >
          <div
            className="absolute inset-0 grid grid-cols-6 grid-rows-7"
            aria-hidden
          >
            {tiles.map((t, i) => {
              const d = open ? t.delay : MAX_DELAY - t.delay;
              return (
                <div
                  key={i}
                  className="relative will-change-[transform,opacity]"
                  style={{
                    transform: open
                      ? `translate3d(${t.dx}vw, ${t.dy}vh, 0) scale(${t.scale})`
                      : "none",
                    opacity: open ? t.dim : 1,
                    filter: open ? "brightness(0.8) saturate(0.9)" : "none",
                    boxShadow: open ? "0 0 0 1px #000" : "none",
                    transition: open
                      ? `transform 1.4s var(--ease-shatter) ${d}ms, opacity 1.2s ease ${d}ms, filter 1.2s ease ${d}ms, box-shadow .2s`
                      : `transform 1.25s var(--ease-shatter) ${d}ms, opacity 1s ease ${d}ms, filter 1s ease ${d}ms, box-shadow .6s`,
                  }}
                >
                  <div
                    className={`absolute -inset-[0.5px] bg-no-repeat [background-image:var(--portrait-sm)] md:[background-image:var(--portrait)] ${open ? "animate-drift" : ""}`}
                    style={
                      {
                        "--portrait": `url(${portrait})`,
                        "--portrait-sm": `url(${portraitMobile})`,
                        backgroundSize: `${coverW} ${coverH}`,
                        backgroundPosition: `calc((${coverW} - 100cqw) / -2 - ${t.col} * 100cqw / ${COLS}) calc((${coverH} - 100cqh) * -0.3 - ${t.row} * 100cqh / ${ROWS})`,
                        animationDelay: `${1400 + t.delay}ms`,
                        "--drift": `${t.drift}s`,
                        "--ddx": `${t.ddx}px`,
                        "--ddy": `${t.ddy}px`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* logotip nad sliko */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute bottom-full left-1/2 z-10 h-auto w-[clamp(220px,26vw,420px)] max-w-none -translate-x-1/2 translate-y-[38%] animate-rise transition-all duration-700 ease-shatter group-data-[open=true]:translate-y-[10%] group-data-[open=true]:opacity-0 group-data-[open=true]:blur-sm"
          />

          {/* gumb EXPLORE */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="home-menu"
            tabIndex={open ? -1 : 0}
            className="group/btn absolute left-1/2 top-full z-10 size-[108px] -translate-x-1/2 -translate-y-1/2 animate-pop transition-[opacity,scale] duration-700 ease-shatter group-data-[open=true]:pointer-events-none group-data-[open=true]:scale-40 group-data-[open=true]:opacity-0 max-md:size-[92px]"
          >
            <span className="pointer-events-none absolute inset-0 animate-orbit rounded-full border border-white/35 border-r-white/85 border-b-white/15 border-l-white/60" />
            <span className="pointer-events-none absolute -bottom-[26px] -right-[18px] left-[26px] top-[22px] animate-orbit-reverse rounded-full border border-x-transparent border-y-white/40" />
            <span className="absolute inset-3 grid place-items-center rounded-full bg-disc pl-[0.3em] text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-900 transition-[scale,background-color] duration-500 ease-spring group-hover/btn:scale-108 group-hover/btn:bg-white">
              {exploreLabel}
            </span>
          </button>
        </div>
      </div>

      {/* meni */}
      <nav
        id="home-menu"
        aria-hidden={!open}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-[3vh] group-data-[open=true]:pointer-events-auto"
      >
        <ul className="text-center">
          {links.map((item, i) => (
            <li key={item.id} className="overflow-hidden leading-none">
              <SmartLink
                href={item.href}
                tabIndex={open ? 0 : -1}
                style={{
                  transitionDelay: open
                    ? `${0.7 + i * 0.09}s, ${0.7 + i * 0.09}s, ${0.7 + i * 0.09}s, 0s, 0s`
                    : "0s",
                }}
                className="inline-block origin-bottom translate-y-[110%] scale-y-[1.28] px-[0.1em] py-[0.12em] font-display text-[clamp(42px,6.4vh,72px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-bone opacity-0 blur-sm transition-[translate,opacity,filter,letter-spacing,text-shadow] duration-[1000ms,900ms,900ms,500ms,300ms] ease-out-expo hover:tracking-[0.08em] hover:text-white hover:text-glow group-data-[open=false]:duration-[500ms,300ms,300ms,500ms,300ms] group-data-[open=false]:ease-shatter group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 group-data-[open=true]:blur-none max-md:text-[clamp(34px,10vw,52px)]"
              >
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="relative py-2 pl-[0.24em] text-xs uppercase tracking-[0.24em] text-bone opacity-0 transition-opacity duration-300 after:absolute after:bottom-0.5 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:left-0 hover:after:w-full group-data-[open=true]:opacity-100 group-data-[open=true]:delay-[1200ms] group-data-[open=true]:duration-600"
        >
          {backLabel}
        </button>
      </nav>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Krožni kurzor z logotipom, ki z zamikom sledi miški.
 * Krog je izrisan v polni velikosti (72 px) in v mirovanju pomanjšan (scale 0.64), zato je ob povečanju nad povezavo oster.
 */
export default function CustomCursor({ image }: { image: string }) {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let visible = false;
    const set = (k: string, v: boolean) => {
      if (ring.current) ring.current.dataset[k] = String(v);
      if (dot.current) dot.current.dataset[k] = String(v);
    };

    const move = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        set("visible", true);
      }
      if (dot.current)
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      const el = e.target as HTMLElement | null;
      set("hover", !!el?.closest("a, button, [data-cursor='hover']"));
    };
    const leave = () => {
      visible = false;
      set("visible", false);
    };
    const down = () => set("down", true);
    const up = () => set("down", false);

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  const base =
    "pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 transition-opacity duration-300 will-change-transform data-[visible=true]:opacity-100 max-md:hidden";

  return (
    <>
      <div ref={ring} className={`group size-0 ${base}`} aria-hidden>
        <div
          className="absolute -left-9 -top-9 size-18 scale-[0.64] rounded-full border-[1.5px] border-white/85 bg-[length:88%] bg-center bg-no-repeat transition-[scale,background-color] duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-data-[hover=true]:scale-100 group-data-[hover=true]:bg-white/10 group-data-[down=true]:scale-[0.56]"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
      <div
        ref={dot}
        className={`-ml-0.5 -mt-0.5 size-1 rounded-full bg-white ${base}`}
        aria-hidden
      />
    </>
  );
}

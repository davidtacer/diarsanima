"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Item = {
  id: string;
  label: string;
  href: string;
  numeral: string;
  active: boolean;
};

/** Mobilni meni (pod md): gumb odpre celozaslonski meni na platnu. Vse oznake pridejo iz site.json. */
export default function MobileMenu({
  items,
  menuLabel,
  closeLabel,
  languages,
}: {
  items: Item[];
  menuLabel: string;
  closeLabel: string;
  languages?: { code: string; href: string; active: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.28em] text-char"
      >
        <span aria-hidden className="flex w-6 flex-col gap-[5px]">
          <span className="h-px w-full bg-char" />
          <span className="h-px w-2/3 self-end bg-char" />
        </span>
        {menuLabel}
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={menuLabel}
            data-open={open}
            className="group fixed inset-0 z-[70] flex flex-col bg-paper px-4 pb-10 pt-5 opacity-0 transition-opacity duration-500 ease-shatter pointer-events-none data-[open=true]:pointer-events-auto data-[open=true]:opacity-100"
          >
            <div
              aria-hidden
              className="bg-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
            />
            <div className="relative flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-3 py-2 text-[11px] uppercase tracking-[0.28em] text-char"
              >
                {closeLabel}
                <span aria-hidden className="relative block size-5">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-char" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-char" />
                </span>
              </button>
            </div>

            <nav className="relative my-auto">
              <ul className="flex flex-col gap-5">
                {items.map((item, i) => (
                  <li
                    key={item.id}
                    className="overflow-hidden border-b border-rule pb-4"
                  >
                    <Link
                      href={item.href}
                      tabIndex={open ? 0 : -1}
                      aria-current={item.active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      style={{
                        transitionDelay: open ? `${150 + i * 70}ms` : "0ms",
                      }}
                      className="flex translate-y-4 items-baseline gap-4 opacity-0 transition-[opacity,translate] duration-700 ease-out-expo group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100"
                    >
                      <span
                        className={`w-9 shrink-0 font-display text-2xl italic ${item.active ? "text-rose" : "text-gold"}`}
                      >
                        {item.numeral}
                      </span>
                      <span
                        className={`font-display text-[clamp(36px,11vw,52px)] uppercase leading-[0.95] break-words ${
                          item.active
                            ? "font-normal italic text-rose"
                            : "font-bold text-char"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.active && (
                        <span
                          aria-hidden
                          className="ml-auto self-center text-sm text-ochre"
                        >
                          ✦
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {languages && languages.length > 1 && (
              <div className="relative flex gap-5 text-xs uppercase tracking-[0.28em]">
                {languages.map((l) => (
                  <Link
                    key={l.code}
                    href={l.href}
                    hrefLang={l.code}
                    lang={l.code}
                    tabIndex={open ? 0 : -1}
                    className={l.active ? "text-char" : "text-char-soft"}
                  >
                    {l.code}
                  </Link>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

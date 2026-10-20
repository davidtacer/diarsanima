import type { Site } from "@/schema/site";
import Signature from "./Signature";

function SocialIcon({ type }: { type: Site["social"][number]["type"] }) {
  if (type === "instagram")
    return (
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 0-1.56 19.88v-7H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57V12h2.78l-.44 2.89h-2.34v7A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

const socialName = { instagram: "Instagram", facebook: "Facebook" } as const;

/**
 * Noga strani. overlay: fiksna čez celozaslonske strani · tone="paper": svetla tema podstrani ·
 * minimal: samo podpis (intro stran). Zadnja vrstica je vedno podpis Inženirji.si.
 */
export default function SiteFooter({
  site,
  lang,
  overlay = false,
  minimal = false,
  tone = "night",
}: {
  site: Site;
  lang: string;
  overlay?: boolean;
  minimal?: boolean;
  tone?: "night" | "paper";
}) {
  const paper = tone === "paper";
  const position =
    overlay || minimal ? "fixed inset-x-0 bottom-0 z-20" : "relative z-10";
  if (minimal)
    return (
      <footer className={`${position} flex justify-center px-4 pb-4`}>
        <Signature lang={lang} tone={tone} />
      </footer>
    );
  return (
    <footer
      className={`flex flex-col gap-3 px-[clamp(16px,5vw,64px)] pb-4 pt-[22px] text-[11px] tracking-[0.06em] ${
        paper ? "border-t border-rule text-char-soft" : "text-bone-muted"
      } ${position}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-[18px]">
          {site.social.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={socialName[s.type]}
              className={`${paper ? "text-char" : "text-bone"} opacity-85 transition-opacity hover:opacity-100`}
            >
              <SocialIcon type={s.type} />
            </a>
          ))}
        </div>
        {/* letnica se izračuna ob buildu */}
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
      <div className="flex justify-end max-md:justify-start">
        <Signature lang={lang} tone={tone} />
      </div>
    </footer>
  );
}

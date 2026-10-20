import { BUILD_UPDATED_AT } from "@/config/build";
import { SITE_ID } from "@/config/site-id";
import SmartLink from "@/components/SmartLink";

/**
 * Podpis Inženirji.si v nogi (pravila gradnje, sekcija 12). Del kode predloge, ne vsebine:
 * urejevalnik ga ne more spremeniti ali odstraniti. Besedila po jezikih so fiksna tukaj.
 */
const t = {
  sl: {
    updated: "posodobljeno",
    hover: "Spletna stran, ki jo urejate s pogovorom →",
  },
  en: { updated: "updated", hover: "A website you edit by chatting →" },
  de: {
    updated: "aktualisiert",
    hover: "Eine Website, die Sie per Chat bearbeiten →",
  },
  hr: {
    updated: "ažurirano",
    hover: "Web stranica koju uređujete razgovorom →",
  },
} as const;

// 60 % prosojnost; na platnu 65 %, da kontrast doseže 4,5 : 1 (pravila, sekcija 12.1)
const tones = {
  night: "text-bone opacity-60",
  paper: "text-char opacity-65",
} as const;

export default function Signature({
  lang,
  tone = "night",
}: {
  lang: string;
  tone?: keyof typeof tones;
}) {
  const s = t[lang as keyof typeof t] ?? t.en;
  const date = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(BUILD_UPDATED_AT));
  return (
    <SmartLink
      href={`https://inzenirji.si/?ref=${SITE_ID}`}
      aria-label={`inzenirji.si – ${s.hover.replace(/\s*→$/, "").toLowerCase()}`}
      data-tone={tone}
      className={`signature group/sig inline-flex items-baseline gap-1.5 whitespace-nowrap font-sans text-xs tracking-normal transition-opacity hover:opacity-100 focus-visible:opacity-100 ${tones[tone]}`}
    >
      <span aria-hidden className="text-signature">
        ▌
      </span>
      <span className="max-sm:hidden">
        {s.updated} {date} ·
      </span>
      <span className="font-signature lowercase">
        inzenirji.si
        <span aria-hidden className="signature-cursor">
          _
        </span>
      </span>
      <span className="hidden group-hover/sig:inline group-focus-visible/sig:inline">
        {s.hover}
      </span>
    </SmartLink>
  );
}

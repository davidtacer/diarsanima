"use client";

import { useEffect } from "react";

/** Stran se ne gradi vsak dan: v brskalniku skrije časovno omejene bloke, ki so medtem potekli ali še niso začeli. */
export default function ValidityGuard() {
  useEffect(() => {
    const now = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana" }).format(new Date());
    document.querySelectorAll<HTMLElement>("[data-valid-from],[data-valid-until]").forEach((el) => {
      const from = el.dataset.validFrom;
      const until = el.dataset.validUntil;
      if ((from && now < from) || (until && now > until)) el.hidden = true;
    });
  }, []);
  return null;
}

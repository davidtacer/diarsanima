/** Današnji datum v obliki YYYY-MM-DD (časovni pas strani). */
export const today = (tz = "Europe/Ljubljana") => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());

/** Ali je časovno omejena vsebina danes veljavna. */
export function isActiveNow(from?: string, until?: string, now = today()) {
  if (from && now < from) return false;
  if (until && now > until) return false;
  return true;
}

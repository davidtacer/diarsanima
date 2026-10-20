import type { Metadata } from "next";
import { EDITOR_URL, SITE_ID } from "@/config/site-id";

// Urejevalnik ni nikoli indeksiran, tudi na main, in ni v sitemapu.
export const metadata: Metadata = { title: "Urejevalnik", robots: { index: false, follow: false } };

export default function Uredi() {
  return (
    <iframe
      src={`${EDITOR_URL}/?site=${encodeURIComponent(SITE_ID)}`}
      title="Urejevalnik"
      className="fixed inset-0 z-[10000] h-dvh w-screen border-0 bg-paper"
      allow="clipboard-write"
    />
  );
}

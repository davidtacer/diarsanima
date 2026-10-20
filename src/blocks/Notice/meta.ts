export const meta = {
  type: "notice",
  name: "Obvestilo",
  description:
    "Tanka vrstica z obvestilom (npr. razstava, odprtje, počitnice) z neobvezno povezavo. Z validFrom/validUntil (YYYY-MM-DD) se prikaže samo v tem obdobju. Varianta accent je v rožnati barvi.",
  whenToUse: "Za časovno omejena sporočila. Postavi ga na začetek strani.",
  example: {
    id: "exhibition",
    type: "notice",
    text: "New exhibition at the Maribor Art Gallery, opening 5 December.",
    link: { label: "Contact", page: "contact" },
    variant: "accent",
    validUntil: "2026-12-31",
  },
};

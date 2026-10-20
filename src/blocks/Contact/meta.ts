export const meta = {
  type: "contact",
  name: "Kontakt",
  description:
    "Velik poziv (heading), podnaslov in kontaktni podatki iz site.json (e-pošta, telefon, kraj). Blok nima polj za e-pošto ali telefon: te spremeniš v site.json.contact. Neobvezna illustration je bela linijska risba (npr. tiger), ki se na svetlem ozadju izriše temno in rahlo lebdi. illustrationMobile je neobvezna različica za telefon (npr. samo glava).",
  whenToUse: "Na strani contact. Za spremembo e-naslova ali telefona uredi site.json, ne tega bloka.",
  example: { id: "contact", type: "contact", heading: "Got a project? Let's talk!", sub: "Start a Conversation", illustration: { src: "/uploads/tiger.webp", alt: "Line drawing of a leaping winged tiger" } },
};

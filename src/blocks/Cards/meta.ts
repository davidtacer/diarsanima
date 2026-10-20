export const meta = {
  type: "cards",
  name: "Kartice (storitve)",
  description:
    "Mreža kartic s sliko v paspartuju, naslovom, neobveznim opisom in neobvezno povezavo na stran. Naslov razdelka in uvodna vrstica sta neobvezna.",
  whenToUse: "Za storitve (naročila, delavnice, digitalna umetnost) ali katerikoli kratek seznam s slikami.",
  example: {
    id: "services",
    type: "cards",
    heading: "Services I Craft for My Clients",
    items: [{ id: "commission", title: "Commission Work", image: { src: "/uploads/services/commission-work.webp", alt: "Painted portrait of a grandmother" } }],
  },
};

export const meta = {
  type: "logos",
  name: "Logotipi",
  description:
    "Vrsta logotipov (šole, partnerji, razstavišča) v enotni sivi barvi, ki se ob prehodu z miško obarvajo. Vsak logotip ima sliko z alt (ime ustanove) in neobvezno povezavo https://.",
  whenToUse:
    "Za ustanove, kjer je umetnica študirala, ali partnerje in galerije, s katerimi sodeluje.",
  example: {
    id: "schools",
    type: "logos",
    items: [
      {
        id: "aluo",
        image: {
          src: "/uploads/logos/aluo.webp",
          alt: "Academy of Fine Arts and Design, University of Ljubljana",
        },
      },
    ],
  },
};

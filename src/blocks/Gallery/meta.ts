export const meta = {
  type: "gallery",
  name: "Galerija del",
  description:
    "Mreža umetniških del kot slike na steni (paspartu, senca). Vsako delo ima številko, naslov, podatke (mere, tehnika, kraj, leto) in sliko. Dela so lahko razdeljena v skupine z oznako (npr. Digital Collages).",
  whenToUse:
    "Na straneh posameznih sklopov (paintings, digital-artwork, murals). Ko stranka doda, odstrani ali preimenuje delo, spremeni mere ali vrstni red. Na dela se sklicuje blok catalogue (po id-ju dela), zato id dela ne spreminjaj, če je uporabljen v katalogu.",
  example: {
    id: "paintings",
    type: "gallery",
    groups: [
      {
        id: "oil",
        works: [
          {
            id: "slavic",
            number: "4",
            title: "SLAVIC",
            details: "100×80 cm, Oil on Canvas, Sinji vrh 2023",
            image: {
              src: "/uploads/works/paintings/slavic.webp",
              alt: "Oil portrait of a woman in a Slavic headdress",
            },
          },
        ],
      },
    ],
  },
};

export const meta = {
  type: "catalogue",
  name: "Katalog sklopov",
  description:
    "Stran v slogu muzejskega kataloga. Levo katalogni list (eyebrow, podatki facts, uvodno besedilo intro, podpis umetnice, samodejno kazalo), desno velik naslov iz dveh besed (pokončna + ležeča) in vrstice sklopov. Vsak sklop ima rimsko številko, naslov, povezavo na stran sklopa, 2–3 kratke oznake (meta), opombo, sličice (plates) in delo, ki se ob prehodu z miško dvigne (feature). Sličice in feature so sklici na dela iz bloka gallery na strani sklopa ({ page, work }). Spodaj neobvezen poziv za naročila z vrtečim se pečatom (commission).",
  whenToUse:
    "Na strani artwork. Ko stranka želi spremeniti uvodno besedilo, zamenjati sličice ali izpostavljeno delo sklopa, dodati sklop ali spremeniti poziv za naročila. Novo delo najprej dodaj v galerijo na strani sklopa, nato ga tu navedi po id-ju.",
  example: {
    id: "catalogue",
    type: "catalogue",
    heading: { upright: "Art", italic: "work" },
    eyebrow: "Catalogue · vol. ii",
    facts: [{ id: "based", label: "Based", value: "Maribor, Slovenia" }],
    intro: "Where *mythical creations* meet portraiture.",
    sections: [
      {
        id: "paintings",
        numeral: "I",
        title: "Paintings",
        page: "paintings",
        meta: ["oil on canvas"],
        note: "portraits and archetypes",
        plates: [{ page: "paintings", work: "slavic" }],
        feature: { page: "paintings", work: "slavic" },
      },
    ],
  },
};

export const meta = {
  type: "shatterMenu",
  name: "Portret, ki se razbije v meni",
  description:
    "Celozaslonski portret z velikim logotipom in okroglim gumbom. Klik na gumb razbije portret v ploščice in pokaže velik meni (links). Gumb za nazaj uporabi site.ui.back. Naslov (heading) je skrit, bere ga samo iskalnik.",
  whenToUse: "Samo na strani home. Ko stranka želi zamenjati portret, besedilo gumba ali povezave v velikem meniju (največ 6, kratke).",
  example: {
    id: "portrait-menu",
    type: "shatterMenu",
    heading: "DiArsanima – mystical and human-inspired art",
    portrait: { src: "/uploads/home-portrait.webp", alt: "Oil portrait of a woman in a leather jacket", focal: "top" },
    exploreLabel: "Explore",
    links: [{ id: "artwork", label: "Artwork", page: "artwork" }],
  },
};

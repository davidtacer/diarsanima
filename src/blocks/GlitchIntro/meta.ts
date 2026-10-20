export const meta = {
  type: "glitchIntro",
  name: "Intro z glitch animacijo",
  description:
    "Celozaslonski uvod: slika ozadja z naključnimi vodoravnimi glitch trakovi, linijski tiger na sredini, logotip in povezava (npr. »Explore?«). Naslov (heading) je skrit, bere ga samo iskalnik in bralnik zaslona.",
  whenToUse: "Samo na intro strani (index). Ko stranka želi zamenjati sliko ozadja, tigra ali besedilo/cilj povezave pod logotipom.",
  example: {
    id: "intro",
    type: "glitchIntro",
    heading: "DiArsanima – a showcase of mystical and human-inspired art.",
    background: { src: "/uploads/intro-banner.webp", alt: "Painted desert under a swirling red and blue sky" },
    tiger: { src: "/uploads/tiger.webp", alt: "Line drawing of a winged tiger" },
    tigerMobile: { src: "/uploads/tiger-mobile.webp", alt: "Line drawing of a winged tiger" },
    exploreLabel: "Explore?",
    explorePage: "home",
  },
};

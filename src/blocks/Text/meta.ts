export const meta = {
  type: "text",
  name: "Besedilo",
  description:
    "Odstavki besedila z neobveznim naslovom razdelka. Podpira omejen Markdown: **krepko**, *ležeče* (izriše se v pisavi Bodoni), povezave [besedilo](page:slug) ali https://, alineje (- ). Varianta lead je večja in svetlejša (uvod), body je navadno besedilo. Neobvezno: slika ob besedilu (image, imageSide left/right) in podpis umetnice pod besedilom (showSignature).",
  whenToUse: "Za opise, biografijo, izobrazbo, uvode v razdelke. Za besedilo s fotografijo ob strani dodaj image.",
  example: {
    id: "bio",
    type: "text",
    heading: "Education",
    body: "Academy of Fine Arts and Design, *University of Ljubljana*.",
    variant: "body",
    image: { src: "/uploads/artist-portrait.webp", alt: "Collage portrait of a woman with a pink rose and wings" },
    imageSide: "right",
    showSignature: true,
  },
};

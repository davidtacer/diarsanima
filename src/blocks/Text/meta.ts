export const meta = {
  type: "text",
  name: "Besedilo",
  description:
    "Odstavki besedila z neobveznim naslovom razdelka. Podpira omejen Markdown: **krepko**, *ležeče* (izriše se v pisavi Bodoni), povezave [besedilo](page:slug) ali https://, alineje. Varianta lead je večja in svetlejša (uvod), body je navadno besedilo.",
  whenToUse: "Za opise, biografijo, izobrazbo, uvode v razdelke.",
  example: { id: "bio", type: "text", heading: "Education", body: "Academy of Fine Arts and Design, *University of Ljubljana*.", variant: "body" },
};

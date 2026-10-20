// Seznam del, povzet po WordPress portfoliu (diarsanima.com/portfolio/...).
// `src` je pot znotraj wp-content/uploads. Slike se nalagajo prek wp(), dokler jih ne preneseš lokalno (npm run assets).

export type Work = { no: string; title: string; details: string; src: string; detailSrcs?: string[] };

export const WP_UPLOADS = process.env.NEXT_PUBLIC_WP_UPLOADS ?? "https://diarsanima.com/wp-content/uploads";
export const wp = (src: string) => `${WP_UPLOADS}/${src}`;

export const paintings: Work[] = [
  {
    "no": "1",
    "title": "FULFILLED",
    "details": "100×150 cm, Oil on Canvas, Maribor 2025",
    "src": "2025/11/1-FULFILLED-100x150-cm-Oil-on-Canvas-Maribor-2025.png"
  },
  {
    "no": "3",
    "title": "THE SHAMAN",
    "details": "100×80 cm, Oil on Canvas, Maribor 2023",
    "src": "2025/11/3-THE-SHAMAN-100x80-cm-Oil-on-Canvas-Maribor-2023.png"
  },
  {
    "no": "4",
    "title": "SLAVIC",
    "details": "100×80 cm, Oil on Canvas, Sinji vrh 2023",
    "src": "2025/11/4-SLAVIC-100x80-cm-Oil-on-Canvas-Sinji-vrh-2023.png"
  },
  {
    "no": "4a",
    "title": "MAYA",
    "details": "60×50 cm, Oil on Canvas, Cancun 2023",
    "src": "2025/11/4a-MAYA-60x50-cm-Oil-on-Canvas-Cancun-2023.png"
  },
  {
    "no": "5",
    "title": "CHARKA",
    "details": "70×50 cm, Oil on Canvas, Maribor 2023",
    "src": "2025/11/5-CHARKA-70x50-cm-Oil-on-Canvas-Maribor-2023.png"
  },
  {
    "no": "6",
    "title": "MALAK",
    "details": "90×70 cm, Oil on Canvas, Maribor 2023",
    "src": "2025/11/6-MALAK-90x70-cm-Oil-on-Canvas-Maribor-2023.png"
  },
  {
    "no": "4b",
    "title": "MARY MAGDALENE",
    "details": "40×30 cm, Oil on Canvas, Maribor 2023",
    "src": "2025/11/4b-MARY-MAGDALENE-40x30-cm-Oil-on-Canvas-Maribor-2023.png"
  },
  {
    "no": "7",
    "title": "THE UNDERWATER MAN",
    "details": "60×60 cm, Oil on Canvas, Fiesa 2023",
    "src": "2025/11/7-THE-UNDERWATER-MAN-60x60-cm-Oil-on-Canvas-Fiesa-2023.png"
  },
  {
    "no": "8",
    "title": "MAMA",
    "details": "70×50 cm, Oil on Canvas, Maribor 2022",
    "src": "2025/11/8-MAMA-70x50-cm-Oil-on-Canvas-Maribor-2022.png"
  },
  {
    "no": "9",
    "title": "AN ANGEL'S JUDGEMENT",
    "details": "50×70 cm, Oil on Canvas, Florence 2022",
    "src": "2025/11/9-AN-ANGELS-JUDGEMENT-50x70cm-Oil-on-Canvas-Florence-2022.png"
  },
  {
    "no": "10",
    "title": "GOLDHORN",
    "details": "100×130 cm, Mixed Media on Canvas, Maribor 2021",
    "src": "2025/11/10-GOLDHORN-100x130-cm-Mixed-Media-on-Canvas-Maribor-2021.png"
  },
  {
    "no": "11",
    "title": "THE UNICORN",
    "details": "90×130 cm, Mixed Media on Canvas, Maribor 2019",
    "src": "2025/11/11-THE-UNICORN-90x130-cm-Mixed-Media-on-Canvas-Maribor-2019.png"
  },
  {
    "no": "12",
    "title": "CRANE LADY",
    "details": "140×90 cm, Mixed Media on Canvas, Maribor 2019",
    "src": "2025/11/12-CRANE-LADY-140x90-cm-Mixed-Media-on-Canvas-Maribor-2019.png"
  },
  {
    "no": "13",
    "title": "GOLDEN LADY",
    "details": "100×150 cm, Acrylic on Canvas, Ljubljana 2018",
    "src": "2025/11/13-GOLDEN-LADY-100x150-cm-Acrylic-on-Canvas-Ljubljana-2018.png"
  }
];

export const digitalPaintings: Work[] = [
  {
    "no": "1",
    "title": "BLANKET",
    "details": "Family and Security, Digital Painting",
    "src": "2025/11/1-BLANKET-FAMILY-AND-SECURITY-Digital-Painting.png"
  },
  {
    "no": "2",
    "title": "MAGGIE",
    "details": "Curiosity and Learning, Digital Painting",
    "src": "2025/11/2-MAGGIE-CURIOSITY-AND-LEARNING-Digital-Painting.png"
  },
  {
    "no": "3",
    "title": "ALEXA",
    "details": "Confidence and Expression, Digital Painting",
    "src": "2025/11/3-ALEXA-CONFIDENCE-AND-EXPRESSION-Digital-Painting.png"
  },
  {
    "no": "3b",
    "title": "SUKI",
    "details": "Culture and Tradition, Digital Painting",
    "src": "2025/11/3b-SUKI-CULTURE-AND-TRADITION-Digital-Painting.png"
  },
  {
    "no": "4",
    "title": "LOLITA",
    "details": "Vanity and Charm, Digital Painting",
    "src": "2025/11/4-LOLITA-VANITY-AND-CHARM-Digital-Painting.png"
  },
  {
    "no": "5",
    "title": "ANGELICE",
    "details": "Art and Creativity, Digital Painting",
    "src": "2025/11/5-ANGELICE-ART-AND-CREATIVITY-Digital-Painting.png"
  },
  {
    "no": "5a",
    "title": "SUNNY",
    "details": "Innocence and Simplicity, Digital Painting",
    "src": "2025/11/5a-SUNNY-INNOCENCE-AND-SIMPLICITY-Digital-Painting.png"
  },
  {
    "no": "5b",
    "title": "IVANA",
    "details": "Letting Go and Cleansing, Digital Painting",
    "src": "2025/11/5b-IVANA-LETTING-GO-AND-CLEANSING-Digital-Painting.png"
  },
  {
    "no": "6",
    "title": "PEPPER",
    "details": "Purpose and Discovery, Digital Painting",
    "src": "2025/11/6-PEPPER-PURPOSE-AND-DISCOVERY-Digital-Painting.png"
  },
  {
    "no": "7",
    "title": "NUBA",
    "details": "Authenticity and Courage, Digital Painting",
    "src": "2025/11/7-NUBA-AUTHENTICITY-AND-COURAGE-Digital-Painting.png"
  },
  {
    "no": "8",
    "title": "VOODOO",
    "details": "Myth and Ritual, Digital Painting",
    "src": "2025/11/8-VOODOO-MYTH-AND-RITUAL-Digital-Painting.png"
  },
  {
    "no": "9",
    "title": "GEA",
    "details": "Nature and Connection, Digital Painting",
    "src": "2025/11/9-GEA-NATURE-AND-CONNECTION-Digital-Painting.png"
  },
  {
    "no": "9a",
    "title": "IRIS",
    "details": "Peace and Quiet, Digital Painting",
    "src": "2025/11/9a-IRIS-PEACE-AND-QUIET-Digital-Painting.png"
  },
  {
    "no": "10",
    "title": "SHEEBA",
    "details": "Intuition and Mystery, Digital Painting",
    "src": "2025/11/10-SHEEBA-INTUITION-AND-MYSTERY-Digital-Painting.png"
  },
  {
    "no": "11",
    "title": "ALLEGRA",
    "details": "Power and Grace, Digital Painting",
    "src": "2025/11/11-ALLEGRA-POWER-AND-GRACE-Digital-Painting.png"
  },
  {
    "no": "12",
    "title": "SAMIRA",
    "details": "Ellegance and Beauty, Digital Painting",
    "src": "2025/11/12-SAMIRA-ELLEGANCE-AND-BEAUTY-Digital-Painting.png"
  }
];

export const digitalCollages: Work[] = [
  {
    "no": "1",
    "title": "DREAM JOY",
    "details": "Digital Collage",
    "src": "2025/11/1-DREAM-JOY-Digital-Collage.png"
  },
  {
    "no": "2",
    "title": "ALONE",
    "details": "Digital Collage",
    "src": "2025/11/2-ALONE-Digital-Collage.png"
  },
  {
    "no": "3",
    "title": "FREE",
    "details": "Digital Collage",
    "src": "2025/11/3-FREE-Digital-Collage.png"
  },
  {
    "no": "4",
    "title": "BIRD OF PARADISE",
    "details": "Digital Collage",
    "src": "2025/11/4-BIRD-OF-PARADISE-Digital-Collage.png"
  },
  {
    "no": "5",
    "title": "VENICE",
    "details": "Digital Collage",
    "src": "2025/11/5-VENICE-Digital-Collage.png"
  },
  {
    "no": "6",
    "title": "IN BETWEEN",
    "details": "Digital Collage",
    "src": "2025/11/6-IN-BETWEEN-Digital-Collage.png"
  },
  {
    "no": "7",
    "title": "THE UNICORN",
    "details": "Collage",
    "src": "2025/11/7-THE-UNICORN-Collage.png"
  },
  {
    "no": "8",
    "title": "SAGRADA",
    "details": "Collage",
    "src": "2025/11/8-SAGRADA-Collage.png"
  },
  {
    "no": "9",
    "title": "LADY OF THE DAWN",
    "details": "Digital Collage",
    "src": "2025/11/9-LADY-OF-THE-DAWN-Digital-Collage.png"
  },
  {
    "no": "10",
    "title": "THE MOTHER",
    "details": "Digital Collage",
    "src": "2025/11/10-THE-MOTHER-Digital-Collage.png"
  },
  {
    "no": "11",
    "title": "THE SPIRIT",
    "details": "Digital Collage",
    "src": "2025/11/11-THE-SPIRIT-Digital-Collage.png"
  },
  {
    "no": "12",
    "title": "HOLY DOODLE",
    "details": "Digital Collage",
    "src": "2025/11/12-HOLY-DOODLE-Digital-Collage.png"
  },
  {
    "no": "13",
    "title": "OFFERING GRACE",
    "details": "Digital Collage",
    "src": "2025/11/13-OFFERING-GRACE-Digital-COllage.png"
  },
  {
    "no": "14",
    "title": "THE TOWER",
    "details": "Digital Collage",
    "src": "2025/11/14-THE-TOWER-Digital-Collage.png"
  },
  {
    "no": "15",
    "title": "VIRGO",
    "details": "Digital Collage",
    "src": "2025/11/15-VIRGO-Digital-Collage.png"
  },
  {
    "no": "16",
    "title": "THE SHADOWS",
    "details": "Digital Collage",
    "src": "2025/11/16-THE-SHADOWS-Digital-Collage.png"
  },
  {
    "no": "17",
    "title": "SNAKE BODY",
    "details": "Digital Collage",
    "src": "2025/11/17-SNAKE-BODY-Digital-Collage.png"
  },
  {
    "no": "18",
    "title": "MONKEY",
    "details": "Digital Collage",
    "src": "2025/11/18-MONKEY-Digital-Collage.png"
  }
];

export const murals: Work[] = [
  {
    "no": "1",
    "title": "WELCOME TO THE JUNGLE",
    "details": "Commission work for living room, Maribor, Slovenia",
    "src": "2022/10/1a-WELCOME-TO-THE-JUNGLE-Comission-work-for-living-room-Maribor-Slovenia.png",
    "detailSrcs": [
      "2022/10/1b.png",
      "2022/10/1c.png"
    ]
  },
  {
    "no": "2",
    "title": "MOON JAGUAR",
    "details": "Commission work for bedroom, 250×230 cm, Ciudad de Mexico, Mexico",
    "src": "2022/10/2a-MOON-JAGUAR-Comission-work-for-bedroom-250x230-cm-Ciudad-de-Mexico-Mexico.png",
    "detailSrcs": [
      "2022/10/2b.png",
      "2022/10/2c.png"
    ]
  },
  {
    "no": "3",
    "title": "SAGRADA",
    "details": "Mural for art residency in Villas Otoch Paraiso, Cancun, Mexico",
    "src": "2022/10/3a-SAGRADA-Mural-for-art-residency-in-Villas-Otoch-Paraiso-Cancun-Mexico.png",
    "detailSrcs": [
      "2022/10/3b.png",
      "2022/10/3c.png"
    ]
  },
  {
    "no": "4",
    "title": "SUN JAGUAR",
    "details": "Commission work for living room, 150×200 cm, Ciudad de Mexico, Mexico",
    "src": "2022/10/4a-SUN-JAGUAR-Comission-work-for-living-room-150x200-cm-Ciudad-de-Mexico-Mexico.png",
    "detailSrcs": [
      "2022/10/4b.png",
      "2022/10/4c.png"
    ]
  },
  {
    "no": "5",
    "title": "CANDY JUNGLE",
    "details": "Commission work for dining room, 270×350 cm, Kamnik, Slovenia",
    "src": "2022/10/5a-CANDY-JUNGLE-Comission-work-for-dining-room-270x350-cm-Kamnik-Slovenia.png",
    "detailSrcs": [
      "2022/10/5b.png",
      "2022/10/5c.png"
    ]
  },
  {
    "no": "6",
    "title": "PERSEUS",
    "details": "Reproduction after Joseph Blanc, commission work for living room, 280×150 cm, Maribor, Slovenia",
    "src": "2022/10/6a-PERSEUS-Reproduction-after-Joseph-Blanc-Comission-work-for-living-room-280x150-cm-Maribor-Slovenia.png",
    "detailSrcs": [
      "2022/10/6b.png",
      "2022/10/6c.png"
    ]
  }
];


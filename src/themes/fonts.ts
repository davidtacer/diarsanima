import localFont from "next/font/local";

/**
 * Pisave teme DiArsanima prek next/font/local: lokalne datoteke (fontsource, latinica), samodejno prednalaganje
 * in nadomestna pisava s prilagojenimi merami, zato se besedilo ob zamenjavi pisave ne premakne (CLS).
 * Znaki latin-ext (č, š, ž) pridejo iz @fontsource uvozov v diarsanima.css, ki se naložijo le po potrebi.
 */
export const bodoni = localFont({
  src: [
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  fallback: ["Didot", "Bodoni 72", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const jost = localFont({
  src: [
    { path: "../../node_modules/@fontsource/jost/files/jost-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/jost/files/jost-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/jost/files/jost-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jost",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

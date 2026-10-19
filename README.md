# DiArsanima — Next.js

Prenos strani diarsanima.com (WordPress/Elementor) v Next.js 15 (App Router, TypeScript) + Tailwind CSS v4.
Brez dodatnih knjižnic za animacije. Keyframe animacije so definirane v `src/app/globals.css` (`@theme`).

## Zagon

```bash
npm install
npm run dev
```

Slike so v `public/images`. **Portret na /home** (`homeBanner.png`) se zaenkrat nalaga z
diarsanima.com. Ko ga shraniš v `public/images/homeBanner.png`, spremeni `homePortrait` v `src/lib/site.ts`.
`npm run assets` prenese vse slike (vključno s homeBanner) z WP strani, dokler ta še obstaja.

## Animacije

| Stran | Komponenta | Kaj dela |
|---|---|---|
| `/` | `src/components/GlitchIntro.tsx` | Ozadje počasi "diha", naključni vodoravni glitch trakovi (izrezi iste slike, zamik + hue/RGB), tiger se ob večjem rafalu strese. |
| `/home` | `src/components/ShatterHome.tsx` | Portret je mreža 6×7 ploščic. EXPLORE → ploščice se razletijo, zatemnijo in lebdijo, pojavi se meni. BACK (ali Esc) → sestavijo se nazaj. |
| vse | `src/components/CustomCursor.tsx` | Krožni kurzor z logotipom, z zamikom sledi miški, poveča se nad povezavami (samo na napravah z miško). |

Nastavitve:
- Število ploščic: `COLS` / `ROWS` v `ShatterHome.tsx` (+ `grid-cols-6 grid-rows-7`).
- Velikost portreta: `h-[70vh] w-[min(44vw,640px)]` v `ShatterHome.tsx`.
- Velikost tigra: `w-[min(100vw,190vh)]` v `GlitchIntro.tsx`.
- Razlet, motnost, zamiki: `makeTiles()` v `ShatterHome.tsx`.
- Pogostost glitcha: `burst()` v `GlitchIntro.tsx`.
- Kam vodi "EXPLORE?" na intro strani: `introExploreHref` v `src/lib/site.ts` (na živi strani vodi na `/artwork`).
- Pisavi: Bodoni Moda (meni/naslovi) + Jost (drobno besedilo) iz Google Fonts, v `layout.tsx`. Zamenjaš ju tam in v `@theme` v `globals.css`.

Spoštuje `prefers-reduced-motion`.

## Kaj je še TODO

Strani `/artwork`, `/about-artist`, `/contact` in `/portfolio/[slug]` imajo strukturo in naslove;
besedila, galerije in pravi e-naslov je treba prenesti iz WP (označeno s `TODO`).

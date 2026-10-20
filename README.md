# DiArsanima

Spletna stran umetnice DiArsanima. Next.js 15 (statični izvoz) + Tailwind v4, zgrajena po **`docs/PRAVILA-GRADNJE.md`** (urejevalnik Inženirji.si).

- Vsa vsebina je v `content/` (site.json + strani), slike v `public/uploads/`. Koda samo izriše vsebino.
- Bloki: `src/blocks/<Ime>/` (komponenta, zod shema, opis za AI), register v `src/blocks/registry.ts`.
- Tema (barve, pisave, animacije po CGP): `src/themes/diarsanima.css`. Pisave so lokalne (`@fontsource`).
- Navodila za AI urejevalnik: `CLAUDE.md`.

## Ukazi

```bash
yarn install
yarn uploads:wp   # enkratno: prenese slike del z WordPressa v public/uploads (nato commitaj)
yarn dev
yarn check        # validate + catalog + tsc + lint + build (obvezno pred commitom)
yarn validate --json
yarn uploads public/uploads/<datoteka>   # nova slika → WebP + velikosti
```

`NEXT_PUBLIC_ENV=production` samo za objavo na `main`. Brez nje stran vrne `noindex`, `robots.txt` z `Disallow: /` in prazen sitemap.

## Animacije

| Blok | Kje | Kaj dela |
| --- | --- | --- |
| `glitchIntro` | `/` | ozadje "diha", glitch trakovi, tiger se ob rafalu strese |
| `shatterMenu` | `/home` | portret iz 6×7 ploščic se razleti v meni, Back ga sestavi |
| `catalogue` | `/artwork` | ob prehodu z miško se delo "dvigne iz arhiva" |
| kurzor | povsod | krožni pečat sledi miški |

## Git

Gradnja na `build/diarsanima` → merge v `dev` → `main` (objava) po uspešnem CI (`.github/workflows/check.yml`).

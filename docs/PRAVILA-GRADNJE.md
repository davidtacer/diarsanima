# Pravila gradnje strani za urejevalnik (Inženirji.si)

Navodila za AI inženirje (agente), ki gradijo novo stranko na predlogi Inženirji.si v Next.js + Tailwind.
Lokacija v repozitoriju predloge: `docs/PRAVILA-GRADNJE.md`. Preberi celoten dokument, preden začneš.

> **Zlato pravilo:** vse, kar obiskovalec vidi (besedila, cene, slike, povezave, delovni čas, kontakt, oznake gumbov), pride iz `content/`. Koda samo izriše vsebino. Če bi za spremembo vsebine moral nekdo popraviti `.tsx`, je stran zgrajena narobe in urejevalnik je ne bo mogel urejati.

Zakaj: urejevalnik s pogovorom (nivo 1) sme pisati **samo** v `content/` in `public/uploads/`. Vse ostalo je zanj zaklenjeno. Česar ni v JSON, stranka ne more spremeniti sama.

---

## 1. Struktura repozitorija

```
content/
  site.json                 # ime, kontakt, delovni čas, navigacija, jeziki, tema, SEO privzeto, UI oznake
  pages/
    index.json              # domača stran (obvezna, ne sme se izbrisati)
    <slug>.json             # vsaka podstran = ena datoteka
  i18n/
    en/
      site.json             # samo prevedljiva polja
      pages/<slug>.json     # ista struktura kot content/pages
public/uploads/             # slike stranke (optimizirane, brez EXIF)
src/
  blocks/<Ime>/             # en blok = ena mapa (glej sekcijo 3)
  blocks/registry.ts        # seznam vseh blokov
  schema/                   # zod sheme strani, site.json in skupnih tipov
  lib/content.ts            # branje in validacija vsebine (edino mesto, ki bere content/)
  app/                      # Next.js App Router, statični izvoz
scripts/
  validate.ts               # validacija celotne vsebine
  catalog.ts                # izvoz kataloga blokov za urejevalnik
CLAUDE.md                   # pravila za AI urejevalnik (glej sekcijo 11)
docs/PRAVILA-GRADNJE.md     # ta dokument
```

- `next.config` ima `output: 'export'`. Brez API poti, brez strežniških funkcij, brez middleware.
- V `src/` ni nobenega besedila, ki ga vidi obiskovalec. Izjema so samo tehnični atributi (npr. `aria-hidden`).

---

## 2. Vsebinske datoteke

### 2.1 `site.json`: en vir resnice

Vsak podatek, ki se pojavi na več mestih, je zapisan **enkrat** v `site.json` in se nanj sklicujejo bloki. Tako sprememba telefonske številke z enim sporočilom popravi glavo, nogo, kontakt in gumbe.

```json
{
  "name": "Gostilna Pri Lipi",
  "defaultLanguage": "sl",
  "languages": ["sl", "en"],
  "contact": {
    "phone": "+386 41 123 456",
    "email": "info@prilipi.si",
    "address": { "street": "Lipova ulica 5", "postalCode": "2000", "city": "Maribor", "country": "SI" },
    "geo": { "lat": 46.5547, "lng": 15.6459 }
  },
  "hours": {
    "regular": [
      { "days": ["mon", "tue", "wed", "thu", "fri"], "open": "10:00", "close": "22:00" },
      { "days": ["sat"], "open": "12:00", "close": "22:00" },
      { "days": ["sun"], "closed": true }
    ],
    "exceptions": [
      { "date": "2026-12-24", "open": "10:00", "close": "14:00", "note": "Božični večer" },
      { "date": "2026-12-25", "closed": true }
    ]
  },
  "navigation": [
    { "label": "Domov", "page": "index" },
    { "label": "Meni", "page": "meni" },
    { "label": "Kontakt", "page": "kontakt" }
  ],
  "social": [{ "type": "instagram", "url": "https://instagram.com/prilipi" }],
  "seo": { "titleTemplate": "%s | Gostilna Pri Lipi", "defaultDescription": "Domača kuhinja v centru Maribora." },
  "theme": { "preset": "prilipi" },
  "ui": {
    "readMore": "Preberi več",
    "callUs": "Pokličite nas",
    "closed": "Zaprto",
    "openingHours": "Delovni čas"
  }
}
```

Pravila:
- **Delovni čas je strukturiran**, nikoli prost tekst. Prazniki gredo v `exceptions` z datumom.
- **Navigacija se sklicuje na `page`** (slug), ne na URL. Povezava se zgradi v kodi, zato preimenovanje ali prevod ne pokvari menija.
- **Vse UI oznake** (gumbi, »Preberi več«, »Zaprto«, oznake obrazcev) so v `ui`. Tudi te se prevajajo.
- `theme.preset` izbere temo stranke (glej sekcijo 5). Barve in pisave so del kode teme, ne vsebine, da AI ne more pokvariti dizajna.

### 2.2 Podstran

```json
{
  "slug": "meni",
  "title": "Jesenski meni",
  "seo": { "description": "Sezonske jedi in cene." },
  "blocks": [
    { "id": "hero-1", "type": "hero", "heading": "Jesenski meni", "image": { "src": "/uploads/buca.jpg", "alt": "Bučna juha v glineni skledi" } },
    { "id": "menu-1", "type": "menu", "groups": [
      { "id": "juhe", "name": "Juhe", "items": [
        { "id": "bucna-juha", "name": "Bučna juha", "description": "S semeni in olivnim oljem", "price": 6.5 }
      ] }
    ] }
  ]
}
```

Pravila:
- **Vsak blok in vsak element seznama ima stabilen `id`** (kebab-case, unikaten znotraj strani). AI z njim najde pravi element, tudi če se vrstni red spremeni.
- **Cene so številke** (`6.5`), ne nizi (`"6,50 €"`). Valuto in format izriše koda (`Intl.NumberFormat` po jeziku).
- **Datumi** so ISO (`2026-12-24`), časi `HH:MM`.
- **Slike so objekt** `{ src, alt }`. `alt` je obvezen in opisen.
- **Ni HTML in ni JSX v nizih.** Za daljša besedila uporabi tip `richText` (sekcija 4.3).
- Slug: male črke, številke, vezaji (`^[a-z0-9-]+$`), brez šumnikov (`zaposlitev`, ne `zaposlitev-šef`).

### 2.3 Prevodi

- Privzeti jezik (`sl`) je v `content/`, ostali v `content/i18n/<jezik>/` z **identično strukturo in istimi `id`-ji**.
- Prevedena datoteka vsebuje vsa polja (ne samo razlike), da jo AI lahko prebere in popravi brez združevanja.
- Prevajajo se samo besedila. Cene, slike (`src`), datumi, `id` in `type` morajo biti enaki kot v izvirniku; to preveri `validate`.
- URL-ji: `sl` brez predpone (`/meni`), ostali s predpono (`/en/meni`). Slug ostane enak v vseh jezikih.
- Preklop jezika in `hreflang` se zgradita samodejno iz `site.languages`. Nov jezik = nov vnos v `languages` + mapa v `i18n/`. Brez spremembe kode.

---

## 3. Bloki

Stran je sestavljena **samo iz blokov**. Strani (`app/[...slug]/page.tsx`) ne vsebujejo postavitve, samo zanko čez `blocks` in izris prek registra.

### 3.1 Kaj ima vsak blok

```
src/blocks/Menu/
  Menu.tsx          # komponenta, dobi samo props iz JSON + kontekst (site, jezik)
  schema.ts         # zod shema bloka
  meta.ts           # ime, opis za AI, primer
```

```ts
// src/blocks/Menu/schema.ts
import { z } from "zod";
import { id, shortText, longText, price } from "@/schema/common";

export const menuItem = z.object({
  id,
  name: shortText(60),
  description: longText(200).optional(),
  price,                                   // z.number().nonnegative().multipleOf(0.01)
  tags: z.array(z.enum(["vegan", "vegetarijansko", "brez-glutena", "pekoče"])).max(4).optional(),
}).strict();

export const menuSchema = z.object({
  id,
  type: z.literal("menu"),
  heading: shortText(80).optional(),
  variant: z.enum(["list", "cards"]).default("list"),
  groups: z.array(z.object({ id, name: shortText(40), items: z.array(menuItem).max(60) }).strict()).min(1).max(20),
}).strict();
```

```ts
// src/blocks/Menu/meta.ts
export const meta = {
  type: "menu",
  name: "Meni",
  description: "Jedilnik ali cenik, razdeljen v skupine (npr. Juhe, Glavne jedi). Za restavracije, kavarne, bare.",
  whenToUse: "Ko stranka želi dodati, spremeniti ali odstraniti jed, pijačo ali ceno.",
  example: { id: "menu-1", type: "menu", groups: [{ id: "juhe", name: "Juhe", items: [{ id: "bucna-juha", name: "Bučna juha", price: 6.5 }] }] },
};
```

```ts
// src/blocks/registry.ts
export const blocks = {
  hero:   { Component: Hero,   schema: heroSchema,   meta: heroMeta },
  menu:   { Component: Menu,   schema: menuSchema,   meta: menuMeta },
  // ...
} as const;
export const blockSchema = z.discriminatedUnion("type", [heroSchema, menuSchema /* ... */]);
```

### 3.2 Pravila za bloke

1. **Shema je stroga** (`.strict()`): neznana polja so napaka, ne tiho ignorirana.
2. **Vsako besedilo ima največjo dolžino**, ki ustreza dizajnu (naslov hero npr. 60 znakov). Če daljše besedilo pokvari postavitev, mora to ujeti shema, ne posnetek.
3. **Nastavitve so `enum`**, nikoli prosti nizi: `variant: "list" | "cards"`, `background: "light" | "dark" | "accent"`. AI lahko izbere samo med tem, kar je oblikovano.
4. **Brez Tailwind razredov iz vsebine** in brez sestavljanja razredov iz nizov (`` `bg-${color}` `` ne deluje, ker Tailwind razredov ne najde ob buildu). Variante preslikaj s fiksnim objektom:
   ```ts
   const bg = { light: "bg-surface text-ink", dark: "bg-ink text-surface", accent: "bg-primary text-on-primary" } as const;
   ```
5. **Prazen ali manjkajoč neobvezen podatek se izriše čisto** (brez praznih naslovov, ločil ali razmikov). Testiraj blok s samo obveznimi polji.
6. **Blok deluje pri 1 in pri največjem dovoljenem številu elementov** (npr. galerija z 1 sliko in s 40).
7. **Kontaktni podatki in delovni čas se v blokih berejo iz `site.json`**, ne podvajajo v blok. Blok Kontakt nima polja `phone`; prikaže `site.contact.phone`.
8. **Strežniška komponenta je privzeta.** `"use client"` samo za blok, ki res rabi interakcijo (galerija s pregledovalnikom, preklop jezika, filter menija), in samo na najmanjšem delu.
9. **Opis v `meta.ts` je napisan za AI urejevalnik**: kaj blok je, kdaj ga uporabiti, primer. Slabo napisan opis = AI izbere napačen blok.

### 3.3 Osnovni katalog (minimum za vsako stranko)

`hero`, `text` (richText), `services` (storitve s ceno in trajanjem), `pricing` (cenik), `menu`, `gallery`, `team`, `testimonials`, `faq`, `contact` (iz site.json + zemljevid), `hours` (iz site.json), `cta`, `notice` (obvestilo/pasica), `promo` (akcija), `jobs` (zaposlitev), `logos`, `map`, `form` (glej 4.5).

### 3.4 Posebnosti stranke

Ko stranka rabi nekaj, česar noben blok ne zna:
1. Najprej preveri, ali obstoječi blok z novo `variant` ali dodatnim neobveznim poljem to pokrije.
2. Če ne: naredi **nov blok** po pravilih iz 3.1 (shema + meta + primer). Nikoli enkratne kode neposredno v strani ali postavitvi.
3. Če je blok uporaben tudi za druge, ga označi v PR opisu za prenos v skupno predlogo.

Prepovedano: »samo tokrat« ročno napisan razdelek v `layout.tsx` ali `page.tsx`, ki ga JSON ne krmili.

---

## 4. Tipi podatkov (skupni, `src/schema/common.ts`)

### 4.1 Besedila
- `shortText(max)`: en odstavek brez prelomov, obrezan presledkov.
- `longText(max)`: dovoljeni prelomi vrstic (`\n`), izriše se kot odstavki.

### 4.2 Slike
```ts
export const image = z.object({
  src: z.string().regex(/^\/uploads\/[a-z0-9\-_.\/]+\.(jpg|jpeg|png|webp|avif|svg)$/),
  alt: shortText(150).min(3),
  focal: z.enum(["center", "top", "bottom", "left", "right"]).default("center"),
}).strict();
```
- Samo lokalne slike iz `public/uploads/`. Brez zunanjih URL-jev (hotlinki se pokvarijo).
- `validate` preveri, da datoteka obstaja.
- Pri statičnem izvozu Next.js ne optimizira slik, zato: slike ob nalaganju pretvori v WebP/AVIF, največ 2400 px širine, več velikosti (`-640`, `-1280`, `-2400`) in izriši z `srcset`, `width`, `height`, `loading="lazy"` (razen hero: `fetchpriority="high"`).
- `focal` določi `object-position`, da AI lahko popravi obrez brez CSS.

### 4.3 Bogato besedilo (`richText`)
- Omejen Markdown: odstavki, **krepko**, *ležeče*, povezave, alineje, oštevilčeni seznami. Brez naslovov (naslove dajo bloki), slik, HTML, tabel.
- Izris z lastnim rendererjem z dovoljenim naborom elementov. Surov HTML se zavrne.
- Povezave: notranje kot `page:meni`, zunanje `https://`. `validate` preveri, da notranja stran obstaja.

### 4.4 Časovno omejena vsebina
Bloki `notice`, `promo`, `jobs` (in vsak, ki ima smisel samo nekaj časa) imajo:
```ts
validFrom: z.string().date().optional(),
validUntil: z.string().date().optional(),
```
- Blok izven obdobja se ne izriše (preverjanje ob buildu **in** v brskalniku z majhnim skriptom, ker se stran ne gradi vsak dan).
- Na tem temelji »skrbnik strani« (opozorila na zastarelo vsebino), zato polja ne izpuščaj.
- Letnica v nogi (`© 2026`) se izračuna, nikoli ni zapisana v JSON ali kodi.

### 4.5 Obrazci in integracije
- Statična stran nima strežnika, zato obrazec pošilja na zunanjo storitev (naš endpoint ali Formspree ipd.). Prejemnik (`site.contact.email` ali `form.recipient`) je v vsebini, endpoint in ključi so v konfiguraciji kode.
- Polja obrazca so v JSON (`fields: [{ id, label, type: "text"|"email"|"tel"|"textarea"|"select", required }]`), da AI lahko doda polje.
- Vdelave (zemljevid, rezervacijski sistem): blok z `provider: enum` in `id`/`url` po shemi. Nikoli poljuben `<iframe>` ali `<script>` iz vsebine.

---

## 5. Dizajn in tema

- Vsaka stranka dobi **unikatno temo** v `src/themes/<preset>.css`: barve, pisave, zaobljenost, razmiki. Tema je koda, ne vsebina.
- Tailwind v4 z žetoni prek CSS spremenljivk:
  ```css
  @theme {
    --color-primary: oklch(0.55 0.15 35);
    --color-on-primary: #fff;
    --color-surface: #faf7f2;
    --color-ink: #1f1a17;
    --font-display: "Fraunces", serif;
    --font-body: "Inter", sans-serif;
  }
  ```
- Bloki uporabljajo **samo žetone** (`bg-primary`, `text-ink`, `font-display`), nikoli fiksnih barv (`bg-[#c0392b]`, `text-red-600`). Tako ista koda bloka deluje pri vsaki stranki.
- Pisave naloži lokalno (`next/font/local` ali samostojne datoteke), ne iz zunanjega CDN-ja.
- Dizajn mora prenesti spremembe vsebine: daljše ime jedi, 3 namesto 6 storitev, manjkajoča slika. Uporabljaj fleksibilne mreže (`grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]`), ne fiksnih višin.
- Mobilno najprej. Preveri na 390 px in 1440 px.

---

## 6. Strani in usmerjanje

- Ena dinamična pot (`app/[[...slug]]/page.tsx` + jezikovna predpona) z `generateStaticParams` iz seznama datotek v `content/pages/` in `site.languages`.
- **Nova podstran = nova JSON datoteka**, brez spremembe kode. To mora delovati; preveri v sekciji 10.
- `index` je domača stran, `404` ima svojo vsebino v `content/pages/404.json`.
- Metapodatki (`title`, `description`, Open Graph slika) iz JSON strani, s privzetimi iz `site.seo`.

---

## 7. SEO in AI iskalniki (GEO)

Vse se generira iz vsebine, nič ročno:
- **JSON-LD `LocalBusiness`** (ali ustrezen podtip: `Restaurant`, `HairSalon`, `MedicalBusiness` ...) iz `site.json`: ime, naslov, telefon, `openingHoursSpecification` (vključno z `exceptions`), `geo`, `sameAs` (social).
- **`FAQPage`** iz bloka `faq`, **`Menu`** iz bloka `menu`, **`Offer`/`Service`** iz storitev s cenami.
- `sitemap.xml` in `robots.txt` ob buildu, z vsemi jeziki in `hreflang`.
- `llms.txt` v korenu: kratek povzetek podjetja, storitev, cen, kontakta, generiran iz vsebine.
- En `<h1>` na stran (prvi blok z naslovom), semantični elementi (`header`, `main`, `nav`, `footer`, `section` z `aria-labelledby`).
- **Testna stran (`dev`) je skrita:** ko je `NEXT_PUBLIC_ENV !== "production"`, dodaj `<meta name="robots" content="noindex,nofollow">`, `robots.txt` z `Disallow: /` in brez sitemap. Gostovanje doda še glavo `X-Robots-Tag`.

---

## 8. Validacija (obvezno pred vsakim commitom)

`package.json`:
```json
{
  "scripts": {
    "validate": "tsx scripts/validate.ts",
    "catalog": "tsx scripts/catalog.ts",
    "check": "npm run validate && npm run catalog && tsc --noEmit && next lint && next build"
  }
}
```

`scripts/validate.ts` mora preveriti:
- vsako stran in `site.json` proti zod shemi (z jasnim sporočilom: datoteka, pot, napaka),
- unikatne `id` znotraj strani in unikatne slug-e,
- da vse slike v `/uploads/` obstajajo,
- da vse notranje povezave (`page:x`, `navigation[].page`) kažejo na obstoječo stran,
- da prevodi obstajajo za vse strani v vseh jezikih in imajo iste `id`, `type`, cene, slike, datume,
- da `index.json` obstaja.

Napake vrača kot JSON (`--json`), da jih urejevalnik lahko pokaže AI-ju za samopopravek.

`scripts/catalog.ts` iz registra izvozi `src/schema/catalog.json` (JSON Schema vsakega bloka prek `zod-to-json-schema` + `meta`). To bere orodje `list_blocks` v urejevalniku, zato ga **vedno commitaj** po spremembi blokov.

CI na `dev` in `main` požene `npm run check`. Rdeč CI = ni merge.

---

## 9. Kaj je prepovedano

- Besedilo, cena, telefon, e-pošta, naslov ali URL slike, zapisan v `.tsx`, `.ts` ali `.css`.
- Ista informacija na dveh mestih v vsebini (npr. telefon v bloku in v `site.json`).
- Prosti nizi za obliko (`"color": "#ff0000"`, `"className": "..."`), HTML ali `<script>` v vsebini.
- Dinamično sestavljeni Tailwind razredi.
- Zunanji URL-ji slik, CDN pisave, sledilniki brez dogovora.
- Postavitev, ki je ne krmili JSON, in »enkratni« razdelki mimo blokov.
- Spreminjanje skupnih blokov predloge za eno stranko (kopiraj v nov blok ali dodaj `variant`).
- Strežniške funkcije, API poti, `getServerSideProps`, ISR (stran je statični izvoz).
- WordPress, page builderji, CMS knjižnice. Urejevalnik je naš.
- Odstranjevanje, skrivanje ali spreminjanje podpisa Inženirji.si (sekcija 12) brez Davidove pisne odobritve.

---

## 10. Test urejevalnika (Definition of Done)

Pred predajo **ročno uredi samo `content/` in `public/uploads/`** in za vsako točko preveri, da `npm run check` uspe in je rezultat na strani pravilen (desktop + mobilno). Če katera točka zahteva spremembo kode, stran ni končana.

1. Spremeni ceno ene jedi/storitve.
2. Spremeni redni delovni čas in dodaj praznično izjemo.
3. Zamenjaj telefonsko številko (mora se spremeniti v glavi, nogi, kontaktu, gumbih, JSON-LD).
4. Dodaj novo storitev/jed z opisom.
5. Dodaj 3 slike na začetek galerije.
6. Dodaj obvestilo na vrh strani z `validUntil` včeraj (se ne sme prikazati) in jutri (se mora).
7. Ustvari novo podstran `zaposlitev` iz obstoječih blokov in jo dodaj v navigacijo.
8. Spremeni vrstni red dveh blokov na domači strani.
9. Dodaj nov jezik (npr. `de`) s prevodom vseh strani; preveri preklop in `hreflang`.
10. Odstrani podstran in njeno povezavo iz navigacije.
11. Vpiši predolg naslov in napačno polje: `validate` mora vrniti jasno napako.
12. Besedilo z dolgimi besedami (»Fizioterapevtska obravnava ...«) ne sme pokvariti mobilne postavitve.

Dodatno ob predaji:
- [ ] Lighthouse mobilno: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- [ ] JSON-LD preverjen (Rich Results Test), `sitemap.xml`, `robots.txt`, `llms.txt` obstajajo.
- [ ] `dev` domena vrača `noindex`.
- [ ] `catalog.json` posodobljen in commitan.
- [ ] `CLAUDE.md` izpolnjen za stranko (sekcija 11).
- [ ] Vse slike imajo smiseln `alt`, brez EXIF.
- [ ] Podpis v nogi (sekcija 12): pravilen datum, povezava z `?ref=<SITE_ID>`, hover deluje, na 390 px ena vrstica, kontrast ≥ 4,5 : 1.

---

## 11. `CLAUDE.md` za urejevalnik

`CLAUDE.md` v korenu je navodilo za **AI urejevalnik**, ne za gradnjo. Predloga ima splošna pravila (piši samo v `content/` in `public/uploads/`, spoštuj sheme, ne briši domače strani, brez nezakonitih vsebin, tujih logotipov in osebnih podatkov brez soglasja). Ob gradnji izpolni sekcijo **»Stranka«**:

- kaj podjetje dela in za koga (2–3 stavki),
- ton (vikanje/tikanje, formalno/sproščeno, primer stavka),
- terminologija (npr. »obravnava«, ne »tretma«; »jedilnik«, ne »meni«),
- kateri bloki so na strani in kaj pomenijo posebni `id`-ji,
- česa AI ne sme spreminjati brez izrecne prošnje (npr. pravna obvestila, cene paketov s pogodbo).

---

## 12. Podpis Inženirji.si v nogi (obvezno)

Vsaka stran ima v nogi isti podpis. Je del kode predloge (`src/components/Signature.tsx`), **ne vsebine**: urejevalnik ga ne more spremeniti ali odstraniti, v `content/` ga ni.

### 12.1 Videz

```
▌ posodobljeno 18. 10. 2026 · inzenirji.si_
```

Ob hoverju (ali fokusu s tipkovnico) se desno razširi: `Spletna stran, ki jo urejate s pogovorom →`

| Del | Pravilo |
| --- | --- |
| `▌` | Naš znak I. Barva `--color-signature` (privzeto `#00FF41`). Na svetlih temah, kjer neon zelena slabo izstopa, ga tema nastavi na temnejšo zeleno ali akcent stranke. |
| »posodobljeno 18. 10. 2026« | Datum zadnje objave na `main`. Pisava stranke (`font-body`). |
| `inzenirji.si` | Vedno monospace (`JetBrains Mono`, lokalno naložen podnabor samo za te znake), male črke. |
| `_` | Utripajoč kurzor (1 s, ostro, brez fade). Pri `prefers-reduced-motion: reduce` ne utripa. |

- Ena vrstica, `text-xs`, barva `currentColor` z 60 % prosojnostjo, zadnja vrstica noge (pod podatki stranke in letnico).
- Na mobilnem se ne lomi v dve vrstici; če je noga ozka, se skrije samo datum, `▌ inzenirji.si_` ostane.
- Kontrast besedila mora biti vsaj 4,5 : 1 glede na ozadje noge. Znak in kurzor sta dekorativna (`aria-hidden`).
- Ni logotipa v sliki, ni okvirja, ni ozadja, ni »Powered by«, »Izdelava:«, »Made with«.

### 12.2 Datum posodobitve

- Izračuna se ob buildu: `git log -1 --format=%cI` (Cloudflare pri buildu klonira repozitorij). Če ukaz ne uspe, uporabi čas builda.
- Format po jeziku strani prek `Intl.DateTimeFormat` (`sl`: `18. 10. 2026`).
- Na veji `dev` je enak mehanizem, da stranka na testni strani vidi, kako bo izgledalo.

### 12.3 Besedila po jezikih

Fiksna v kodi komponente (ne v `ui` vsebine):

| Jezik | Datum | Hover |
| --- | --- | --- |
| sl | posodobljeno | Spletna stran, ki jo urejate s pogovorom → |
| en | updated | A website you edit by chatting → |
| de | aktualisiert | Eine Website, die Sie per Chat bearbeiten → |
| hr | ažurirano | Web stranica koju uređujete razgovorom → |

Za jezik, ki ga ni v tabeli, uporabi angleščino in ga dodaj v tabelo v predlogi.

### 12.4 Povezava

```tsx
<a
  href={`https://inzenirji.si/?ref=${SITE_ID}`}
  className="signature"
  aria-label="inzenirji.si – spletna stran, ki jo urejate s pogovorom"
>
```

- `SITE_ID` iz `src/config/site-id.ts`. Po `ref` CRM prepozna, s katere strani stranke je prišel obiskovalec.
- Besedilo povezave je samo ime znamke `inzenirji.si`. **Brez ključnih besed** (»izdelava spletnih strani« ipd.) v besedilu, `title` ali `aria-label` onkraj zgornjega, ker Google enake povezave s ključnimi besedami v nogah mnogih strani lahko oceni kot manipulacijo.
- Brez `target="_blank"`, brez `nofollow`.
- Na `/uredi` podpisa ni (stran nima noge).

### 12.5 Primer komponente

```tsx
// src/components/Signature.tsx  (strežniška komponenta, edini odjemalski del je CSS animacija)
import { SITE_ID } from "@/config/site-id";
import { BUILD_UPDATED_AT } from "@/config/build"; // zapiše scripts/prebuild.ts iz git log

const t = {
  sl: { updated: "posodobljeno", hover: "Spletna stran, ki jo urejate s pogovorom →" },
  en: { updated: "updated", hover: "A website you edit by chatting →" },
  de: { updated: "aktualisiert", hover: "Eine Website, die Sie per Chat bearbeiten →" },
  hr: { updated: "ažurirano", hover: "Web stranica koju uređujete razgovorom →" },
} as const;

export function Signature({ lang }: { lang: string }) {
  const s = t[lang as keyof typeof t] ?? t.en;
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "numeric", year: "numeric" })
    .format(new Date(BUILD_UPDATED_AT));
  return (
    <a href={`https://inzenirji.si/?ref=${SITE_ID}`} className="signature group inline-flex items-baseline gap-1.5 whitespace-nowrap text-xs opacity-60 hover:opacity-100 focus-visible:opacity-100">
      <span aria-hidden className="text-signature">▌</span>
      <span className="max-sm:hidden">{s.updated} {date} ·</span>
      <span className="font-signature">inzenirji.si<span aria-hidden className="signature-cursor">_</span></span>
      <span className="hidden group-hover:inline group-focus-visible:inline">{s.hover}</span>
    </a>
  );
}
```

```css
@theme { --color-signature: #00FF41; --font-signature: "JetBrains Mono", ui-monospace, monospace; }
.signature-cursor { animation: sig-blink 1s steps(1) infinite; }
@keyframes sig-blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .signature-cursor { animation: none; } }
```

Komponento kliče noga predloge, ne posamezen blok. Tema stranke sme spremeniti samo `--color-signature`.

---

## 13. Git

- Gradnja na veji `build/<stranka>`, nato merge v `dev`. `main` je samo za objavo (merge iz `dev` po uspešnem CI).
- Commit sporočila v slovenščini, v naravnem jeziku (»Dodan blok Cenik s paketi«), kot jih kasneje piše urejevalnik.
- Nikoli ne commitaj ključev, `.env`, osebnih podatkov ali surovih fotografij z EXIF.
- Dokumentacija (ta dokument, `CLAUDE.md`, katalog) je vedno v repozitoriju.

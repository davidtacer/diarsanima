# DiArsanima — navodila za AI urejevalnik

> Ta datoteka je za **AI urejevalnik** (urejanje vsebine s pogovorom).
> Agenti, ki gradijo ali spreminjajo kodo, morajo najprej prebrati **`docs/PRAVILA-GRADNJE.md`** in se ga držati.
> Namestitev na Cloudflare Pages, domene in povezava z urejevalnikom: **`docs/NAMESTITEV-UREJEVALNIKA.md`**.

## Splošna pravila

- Piši **samo** v `content/` in `public/uploads/`. Vse ostalo (`src/`, `scripts/`, konfiguracija) je zaklenjeno.
- Spoštuj sheme blokov (`src/schema/catalog.json`, orodje `list_blocks`). Neznana polja so napaka.
- Po vsaki spremembi poženi `yarn validate --json` in popravi vse javljene napake.
- Domače strani `content/pages/index.json` ne briši.
- Vsak blok in element seznama ima stabilen `id` (kebab-case). Obstoječih `id` ne spreminjaj brez razloga.
- Slike: samo lokalne iz `/uploads/`, vedno z opisnim `alt` (angleško). Novo sliko pripravi z `yarn uploads public/uploads/<pot>`.
- Povezav ne odpiraj "v novem zavihku" ročno: zunanje se odprejo v novem zavihku same, notranje (`page:slug`), `mailto:` in `tel:` v istem.
- Brez HTML-ja, skript ali barv v vsebini. Brez tujih logotipov, nezakonitih vsebin in osebnih podatkov brez soglasja.
- Kontakt (e-pošta, telefon, kraj) je samo v `content/site.json` → `contact`. Bloki ga berejo od tam.
- Letnice v nogi ne piši: izračuna se sama.
- Podpis Inženirji.si v nogi je del kode, ne vsebine. Ne odstranjuj ga, ne skrivaj in ne spreminjaj (pravila gradnje, sekcija 12).

## Stranka

**Kdo:** DiArsanima (DiA), multidisciplinarna vizualna umetnica iz Maribora. Slika portrete in arhetipe (olje, akril, mešane tehnike), dela digitalne kolaže in digitalne slike (serija arhetipov) ter freske po naročilu. Stran je njen spletni katalog za ljubitelje umetnosti, zbiratelje in naročnike.

**Jezik in ton:** stran je v **angleščini**. Ton je miren, skoraj obreden, nikoli prodajni. Kratki stavki, brez klicajev (izjema: »Got a project? Let's talk!«). O umetnici v tretji osebi (»her artwork«), v prvi osebi samo, ko govori sama (»Services I Craft for My Clients«).
Primer: *»Where mythical creations meet portraiture in different artistic mediums, formats and techniques.«*

**Terminologija:**
- »artwork«, »works«, ne »products« ali »items«.
- »commission« (naročilo), ne »order«.
- »mural«, ne »wall painting« v naslovih.
- Ponavljajoče se besede znamke: *mythical, archetype, ritual, fusion, portraiture, heritage*. Uporabljaj jih samo, kjer so resnične.
- Ime: vedno **DiArsanima** (velika A) ali **DiA**.
- Napis dela: `ŠTEVILKA` + `NASLOV` (velike črke) + `details` v obliki `100×80 cm, Oil on Canvas, Maribor 2023`.

**Strani in posebni bloki:**
| Stran | Bloki | Opomba |
| --- | --- | --- |
| `index` | `glitchIntro` | intro z animacijo; `explorePage` = kam vodi »Explore?« |
| `home` | `shatterMenu` | portret, ki se razbije v meni (`links`) |
| `artwork` | `catalogue` | katalog sklopov; `plates` in `feature` so sklici `{ page, work }` na dela v galerijah |
| `paintings`, `digital-artwork`, `murals` | `pageHeading`, `gallery`, `cta` | vsa dela; `navParent: "artwork"` |
| `about-artist` | `pageHeading`, `text`, `cards`, `cta` | biografija, storitve, izobrazba |
| `contact` | `pageHeading`, `contact` | e-pošta iz `site.json` |

**Dodajanje dela:** delo dodaj v blok `gallery` na strani sklopa (id = naslov v kebab-case, npr. `lady-of-the-dawn`). Če naj se pojavi v katalogu na `artwork`, ga dodaj še v `plates` ali `feature` tega sklopa. Id dela, ki je uporabljen v katalogu, ne spreminjaj.

**Česa ne spreminjaj brez izrecne prošnje:**
- uvodnega besedila v katalogu (`artwork` → `catalogue.intro`): to je umetničino uradno besedilo,
- imen in številk del (številke so njeno oštevilčenje, ne vrstni red),
- `brand` slik v `site.json` (logotip, pečat, vodni žig, podpis),
- strukture strani `index` in `home`.

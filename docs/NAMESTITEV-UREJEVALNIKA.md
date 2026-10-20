# Namestitev urejevalnika na novo stran stranke

Za koga: David (ročni koraki) in AI inženirji (koraki v kodi).
Gostovanje: **Cloudflare Pages** (odločeno 20. 10. 2026).
Lokacija v repozitoriju predloge: `docs/NAMESTITEV-UREJEVALNIKA.md`. Gre skupaj z `docs/PRAVILA-GRADNJE.md`.

## Kaj na koncu dobimo

- **Prava stran** `vasa-stran.si`: zgradi se iz veje `main` in jo vidijo vsi.
- **Testna stran** `dev.vasa-stran.si`: zgradi se iz veje `dev`. Vidi jo samo stranka, Google je ne indeksira.
- **Urejevalnik** na `vasa-stran.si/uredi`: stranka se prijavi in piše spremembe. Te gredo najprej na testno stran, z gumbom »Objavi« pa na pravo.

Za vsako novo stranko ponovi korake 1 do 7, po vrsti. Zraven vsakega koraka piše, kdo ga naredi.

> **Stanje 20. 10. 2026:** strežnik urejevalnika (`uredi.inzenirji.si`), naša GitHub App in admin urejevalnika še niso zgrajeni. Koraka 4 in 6 zato veljata, ko bodo. Koraki 1–3, 5 in 7 delujejo že zdaj.

---

## Korak 0: preden začneš (David, enkrat na stranko)

Pripravi si:
- ime stranke in kratko ime projekta, male črke in vezaji, npr. `gostilna-pri-lipi`,
- domeno stranke (npr. `prilipi.si`) in kje je registrirana (npr. Domenca, Arnes, GoDaddy),
- dostop do te domene: ali uporabniško ime in geslo stranke pri registrarju, ali pa stranko, ki bo korak opravila z naše navodilo,
- e-pošto lastnika, na katero bo prihajala povezava za prijavo v urejevalnik.

---

## Korak 1: repozitorij na GitHubu (David, ~5 min)

Repozitorij je v naši organizaciji, razen če stranka izrecno želi svojega (glej 1b).

### 1a. Repozitorij v naši organizaciji

1. Odpri https://github.com/new.
2. **Repository template:** izberi repozitorij naše predloge strani.
3. **Owner:** naša organizacija (oz. `davidtacer`, dokler organizacije ni).
4. **Repository name:** kratko ime projekta, npr. `gostilna-pri-lipi`.
5. Izberi **Private**.
6. Klikni **Create repository**.
7. Pričakuješ: nov repozitorij z vsemi datotekami predloge, veja `main`.

Nato ustvari vejo `dev`:
1. V repozitoriju klikni na spustni seznam z napisom **main** (levo zgoraj nad datotekami).
2. V polje vpiši `dev`.
3. Klikni **Create branch dev from main**.
4. Pričakuješ: v seznamu vej sta zdaj `main` in `dev`.

Zaščiti `main`:
1. V repozitoriju odpri **Settings** → **Branches** (levi meni, pod »Code and automation«).
2. Klikni **Add classic branch protection rule** (ali **Add rule**).
3. **Branch name pattern:** `main`.
4. Obkljukaj **Require status checks to pass before merging** in v iskalno polje vpiši `check`. Prikaže se šele, ko je CI enkrat tekel; če ga še ni, se vrni po koraku 3.
5. Obkljukaj **Do not allow bypassing the above settings**. Tega ne obkljukaj, dokler GitHub App (korak 4) ne obstaja, sicer je ne bo mogla merge-ati.
6. Klikni **Create**.

### 1b. Repozitorij pri stranki

Stranka ustvari repozitorij na svojem računu po zgornjih korakih in te doda kot sodelavca (**Settings** → **Collaborators** → **Add people**). Korak 4 nato namesti GitHub App na njen račun.

---

## Korak 2: gradnja strani (AI inženirji)

Po `docs/PRAVILA-GRADNJE.md`. Na koncu mora:
- `npm run check` uspeti,
- test urejevalnika (sekcija 10 pravil gradnje) prestati vseh 12 točk,
- vse biti na veji `dev`, merge v `main` pa šele, ko David stran pregleda.

Dve stvari, ki morata biti v kodi zaradi Cloudflara:

**a) Skrivanje testne strani.** Cloudflare med gradnjo nastavi spremenljivko `CF_PAGES_BRANCH`. Skripta `scripts/postbuild.ts` (teče po `next build`) zapiše v `out/`:

- če `CF_PAGES_BRANCH === "main"`:
  - `_headers` brez noindex,
  - običajen `robots.txt`,
  - `sitemap.xml`;
- sicer:
  - `_headers` z `X-Robots-Tag: noindex, nofollow` za `/*`,
  - `robots.txt` z `Disallow: /`,
  - brez sitemap.

Enako `NEXT_PUBLIC_ENV` (production / preview) uporabi za `<meta name="robots">`, glej pravila gradnje, sekcija 7.

**b) Pot `/uredi`.** Predloga ima `app/uredi/page.tsx`, ki prikaže celozaslonski iframe na `https://uredi.inzenirji.si/?site=<SITE_ID>`. `SITE_ID` je v `src/config/site-id.ts` (koda, ne vsebina). Stran `/uredi` ima `noindex` vedno, tudi na `main`, in ni v sitemapu.

---

## Korak 3: projekt na Cloudflare Pages (David, ~10 min)

1. Prijavi se na https://dash.cloudflare.com.
2. Levo v meniju klikni **Workers & Pages**.
3. Klikni **Create** (modri gumb desno zgoraj), nato zavihek **Pages**, nato **Connect to Git**.
   - Prvič te Cloudflare prosi za povezavo z GitHubom. Klikni **Connect GitHub**, izberi račun ali organizacijo, kjer je repozitorij, in pri **Repository access** izberi **Only select repositories** ter dodaj repozitorij stranke. Klikni **Install & Authorize**.
   - Pri naslednjih strankah na tej točki klikni **Configure GitHub** in samo dodaj nov repozitorij.
4. Izberi repozitorij stranke in klikni **Begin setup**.
5. Izpolni:
   - **Project name:** kratko ime projekta (`gostilna-pri-lipi`). Iz tega nastane `gostilna-pri-lipi.pages.dev`.
   - **Production branch:** `main`.
   - **Framework preset:** `Next.js (Static HTML Export)`.
   - **Build command:** `npm run build`.
   - **Build output directory:** `out`.
6. Odpri **Environment variables (advanced)** in dodaj `NODE_VERSION` = `22`.
7. Klikni **Save and Deploy**.
8. Pričakuješ: po 1–3 minutah zeleno **Success** in povezavo `gostilna-pri-lipi.pages.dev`. Odpri jo, stran mora delovati.

Omejitev predogledov samo na vejo `dev` (da se ne gradi vsaka testna veja):
1. V projektu odpri **Settings** → **Builds & deployments** (oziroma **Build** → **Branch control**).
2. Pri **Preview branch** izberi **Custom branches**.
3. **Include preview branches:** `dev`.
4. Klikni **Save**.
5. Na GitHubu naredi en commit na `dev` (ali v Cloudflaru pri `dev` klikni **Retry deployment**), da se `dev` prvič zgradi.
6. Pričakuješ: deluje `https://dev.gostilna-pri-lipi.pages.dev`.

---

## Korak 4: GitHub App urejevalnika (David, ~2 min)

Urejevalnik piše v repozitorij prek naše GitHub App (ko bo ustvarjena).

1. Odpri stran naše aplikacije: `https://github.com/apps/<ime-nase-aplikacije>`.
2. Klikni **Configure** (oziroma **Install**, če je še nikjer ni).
3. Izberi račun ali organizacijo, kjer je repozitorij stranke.
4. Izberi **Only select repositories** in dodaj repozitorij stranke. Ne izberi »All repositories«.
5. Klikni **Save**.
6. Pričakuješ: v repozitoriju stranke je pod **Settings** → **GitHub Apps** vidna naša aplikacija.

---

## Korak 5: domene in DNS (David, ~15 min + čakanje)

Najlažje in najbolj zanesljivo je, da domena stranke uporablja Cloudflarove imenske strežnike. Samo tako lahko na isti domeni brez težav nastavimo tudi `dev.`. Domena ostane registrirana pri istem registrarju in na stranko, menjajo se samo imenski strežniki.

### 5a. Domeno dodaj v Cloudflare

1. Na https://dash.cloudflare.com klikni **Add** → **Connect a domain** (ali **Add a site**).
2. Vpiši domeno (`prilipi.si`), izberi **Quick scan for DNS records** in klikni **Continue**.
3. Izberi paket **Free** in klikni **Continue**.
4. Cloudflare pokaže najdene DNS zapise. **Preveri, da so tam MX zapisi** (e-pošta stranke). Če jih ni, jih prepiši iz trenutnega DNS pri registrarju, sicer bo stranki nehala delovati e-pošta.
5. Klikni **Continue to activation**. Cloudflare pokaže **dva imenska strežnika**, npr. `ada.ns.cloudflare.com` in `bob.ns.cloudflare.com`. Zapiši ju.

### 5b. Imenska strežnika zamenjaj pri registrarju

1. Prijavi se pri registrarju domene.
2. Poišči nastavitev **Imenski strežniki / DNS strežniki / Nameservers** za domeno.
3. Obstoječe zamenjaj z obema Cloudflarovima. Ostale izbriši.
4. Shrani.
5. Pričakuješ: Cloudflare v nekaj urah (lahko do 24 h) pošlje e-pošto, da je domena aktivna, in v pregledu domene piše **Active**.

### 5c. Prava stran na domeni

1. **Workers & Pages** → projekt stranke → zavihek **Custom domains** → **Set up a custom domain**.
2. Vpiši `prilipi.si`, klikni **Continue** → **Activate domain**.
3. Ponovi za `www.prilipi.si`.
4. Pričakuješ: po nekaj minutah pri obeh piše **Active** in `https://prilipi.si` kaže stran.

### 5d. Testna stran na `dev.`

1. V istem zavihku **Custom domains** → **Set up a custom domain** → vpiši `dev.prilipi.si` → **Continue** → **Activate domain**.
2. Odpri **DNS** za domeno `prilipi.si` (levi meni pri domeni → **DNS** → **Records**).
3. Poišči zapis tipa **CNAME** z imenom `dev`. Klikni **Edit**.
4. **Target** spremeni iz `gostilna-pri-lipi.pages.dev` v `dev.gostilna-pri-lipi.pages.dev`. Klikni **Save**.
5. Pričakuješ: `https://dev.prilipi.si` kaže zadnjo različico veje `dev`. Preveri še skrivanje: v terminalu (Mac: aplikacija Terminal) vpiši `curl -I https://dev.prilipi.si` in pritisni Enter. Med izpisanimi vrsticami mora biti `x-robots-tag: noindex, nofollow`.

> Če 4. točke ne narediš, `dev.prilipi.si` kaže pravo stran (`main`), ne testne.

---

## Korak 6: stranka v urejevalniku (David, ~3 min)

V adminu urejevalnika (ko bo narejen) dodaj stranko:

| Polje | Primer |
| --- | --- |
| Ime | Gostilna Pri Lipi |
| `SITE_ID` | `gostilna-pri-lipi` (enak kot v `src/config/site-id.ts`) |
| GitHub repozitorij | `davidtacer/gostilna-pri-lipi` |
| Veji | `dev` (testna), `main` (prava) |
| Cloudflare projekt | `gostilna-pri-lipi` |
| Testna domena | `https://dev.prilipi.si` |
| Prava domena | `https://prilipi.si` |
| E-pošta lastnika | lastnik@prilipi.si |
| Začetno dobroimetje | 2 € |

Urejevalnik iz Cloudflara prebere, kdaj je build končan, s skupnim API žetonom, ki je nastavljen enkrat za vse stranke (glej dodatek A). Za posamezno stranko tega ne nastavljaš.

---

## Korak 7: preizkus (David, ~5 min)

1. Odpri `https://prilipi.si/uredi`. Pričakuješ: okno za prijavo.
2. Vpiši e-pošto lastnika in klikni povezavo iz e-pošte. Pričakuješ: okno za pogovor.
3. Napiši: »Spremeni ceno bučne juhe na 7 €.« Pričakuješ:
   - čez 1–2 minuti posnetek spremembe in povezavo na testno stran,
   - na `https://dev.prilipi.si` nova cena,
   - na `https://prilipi.si` še stara.
4. Klikni **Objavi v živo**. Pričakuješ: čez 1–2 minuti nova cena na `https://prilipi.si`.
5. Klikni **Razveljavi**. Pričakuješ: na `https://prilipi.si` spet stara cena.
6. Na GitHubu v repozitoriju (**Commits**) mora biti vidna vsaka od teh sprememb s sporočilom v slovenščini.
7. Preveri, da Google testne strani ne vidi: odpri `https://dev.prilipi.si/robots.txt`, kjer mora pisati `Disallow: /`.

Ko je vse zeleno, stranki pošlji povezavo `vasa-stran.si/uredi` in na predaji pokaži, kako deluje (10 min).

---

## Dodatek A: Cloudflare API žeton za urejevalnik (David, enkrat za vse stranke)

1. Na https://dash.cloudflare.com/profile/api-tokens klikni **Create Token** → **Create Custom Token** → **Get started**.
2. **Token name:** `urejevalnik-pages-read`.
3. **Permissions:** `Account` → `Cloudflare Pages` → `Read`.
4. **Account Resources:** `Include` → naš račun.
5. Klikni **Continue to summary** → **Create Token**.
6. Žeton se pokaže samo enkrat. Kopiraj ga in ga vpiši v admin nastavitve urejevalnika (ne v kodo in ne v GitHub).

## Dodatek B: pogoste težave

| Težava | Vzrok | Rešitev |
| --- | --- | --- |
| Build na Cloudflaru pade | `npm run check` lokalno ne uspe ali napačna različica Node | V Cloudflaru odpri build → **View logs**. Preveri `NODE_VERSION` in da je output `out`. |
| `dev.domena.si` kaže pravo stran | CNAME `dev` kaže na `projekt.pages.dev` | Korak 5d, točka 4. |
| Stranki ne dela e-pošta po menjavi DNS | MX zapisi niso bili prepisani | V Cloudflare DNS dodaj MX zapise, kot so bili pri registrarju. |
| Urejevalnik ne more objaviti | GitHub App ni nameščena na repozitorij ali zaščita `main` brez izjeme | Korak 4, korak 1a točka 5. |
| Testna stran je na Googlu | manjka `_headers` / `robots.txt` za ne-`main` | Korak 2a; preveri `curl -I https://dev.domena.si`. |
| Domena v Cloudflaru po 24 h ni Active | Imenska strežnika pri registrarju nista prav vpisana | Korak 5b; preveri, da sta vpisana točno ta dva in nobeden drug. |

# Ghid pentru crearea proiectelor și repository-urilor noi

## 1. Scop

Acest document este sursa de adevăr pentru pornirea unui proiect nou și pentru
crearea repository-ului său GitHub.

Regula principală este simplă:

> Nu crea repository-ul, nu inițializa proiectul și nu alege stack-ul înainte
> ca întrebările obligatorii din acest ghid să primească răspunsuri clare.

Dacă o cerință este ambiguă, Cursor AI sau Claude Code trebuie să întrebe.
Nu presupune bugetul, publicul, proprietarul codului, brandingul, domeniul,
vizibilitatea repository-ului, serviciile plătite sau limitele MVP-ului.

---

## 2. Convenții confirmate din proiectele recente

Repository-urile create cel mai recent confirmă următoarele practici:

- `tool-compression`, `tool-conversion`, `tool-qr-generator`,
  `tool-file-transfer` și `tool-onetimesecret` folosesc prefixul `tool-`;
- proiectele de cercetare folosesc `lab-`, de exemplu `lab-qca-lab`;
- website-urile și aplicațiile web generale folosesc `web-`;
- descrierea GitHub începe cu un emoji relevant și explică produsul și stack-ul;
- când există un URL planificat sau live, el este completat în câmpul Website;
- topic-urile GitHub descriu produsul, tehnologiile, domeniul și hostingul real;
- proiectele personale recente pornesc private și folosesc subdomenii
  `*.alexjungean.com`;
- README-ul consemnează calea locală WSL și remote-ul SSH;
- repository-ul local este în `~/projects/<repository>`, adică
  `/home/alex/projects/<repository>` în distribuția `Ubuntu-24.04`;
- stack-ul implicit pentru produsele web recente este Next.js + TypeScript,
  Netlify, Supabase când sunt necesare date persistente și Cloudflare R2 când
  sunt necesare obiecte mari;
- proiectele mature au plan, stare curentă, roadmap și prompt de continuare
  pentru o conversație AI nouă;
- website-urile publice includ atribuirea
  `Developed by Alexandru Jungean`, cu link către `https://alexjungean.com`.

Exemple de formulări bune:

```text
🔐 Client-encrypted one-time secrets with browser AES-GCM and atomic
single-use retrieval, planned with Next.js and Supabase.

📤 Secure expiring file transfers with direct Cloudflare R2 uploads and
Supabase metadata, planned with Next.js and Netlify.
```

Metadata GitHub trebuie verificată din nou la lansare. Descrierea, homepage-ul
și topic-urile nu trebuie să păstreze tehnologii, provideri sau domenii care nu
mai sunt folosite.

---

## 3. Întrebările obligatorii înainte de creare

Agentul trebuie să ceară răspunsuri scurte și explicite la toate întrebările
relevante. Dacă utilizatorul a răspuns deja în conversație sau într-un document
aprobat, nu repeta întrebarea.

### 3.1 Produs și obiectiv

1. Care este problema rezolvată?
2. Cine este utilizatorul principal?
3. Care este rezultatul de business urmărit?
4. Ce intră în MVP și ce este explicit în afara MVP-ului?
5. Care sunt criteriile verificabile de acceptare?
6. Există deadline, buget sau limitări operaționale?

### 3.2 Tipul proiectului

Alege exact una dintre categoriile principale:

1. **Proiect personal / portofoliu**
   - poate folosi un subdomeniu `*.alexjungean.com`;
   - folosește de regulă identitatea vizuală Alexandru Jungean;
   - proprietatea codului rămâne la Jungean-Herman Marius-Alexandru.
2. **Produs comercial propriu**
   - este construit pentru venit, abonamente, lead-uri sau vânzare;
   - proprietatea rămâne implicit la Jungean-Herman Marius-Alexandru;
   - necesită model de monetizare și termeni comerciali expliciți.
3. **Proiect pentru client**
   - trebuie consemnate numele juridic al clientului și persoana care aprobă;
   - trebuie clarificat dacă brandingul există sau trebuie creat;
   - licența, drepturile comerciale și eventualul transfer de proprietate
     trebuie stabilite înainte de predare.

### 3.3 Branding

1. Clientul/produsul are deja brand book, logo, fonturi și paletă?
2. Dacă nu, trebuie creat un branding nou sau folosim identitatea personală?
3. Cine aprobă direcția vizuală?
4. Ce active pot fi folosite legal?
5. Există mărci, competitori sau interfețe care nu trebuie imitate?

### 3.4 Tehnic și operațional

1. Este website, web app, aplicație mobilă, API, tool, blog, laborator sau altceva?
2. Are nevoie de autentificare, roluri, organizații sau multi-tenancy?
3. Are nevoie de bază de date?
4. Încarcă imagini sau fișiere? Ce dimensiuni, volume și perioade de retenție?
5. Există procesări în fundal, cron, cozi sau integrări externe?
6. Sunt necesare Docker ori Kubernetes? De ce?
7. Care este domeniul sau subdomeniul?
8. Sunt implicate plăți, date medicale, date fiscale, date personale sau minori?
9. Ce medii sunt necesare: local, preview, staging, production?
10. Ce servicii pot genera costuri și cine aprobă activarea lor?

### 3.5 Repository și livrare

1. Care este numele final al repository-ului?
2. Este privat sau public?
3. Cine deține repository-ul GitHub?
4. Clientul primește drept total de utilizare comercială sau proprietatea?
5. Este permis backlink-ul `Developed by Alexandru Jungean`?
6. CI este obligatoriu? Ce verificări trebuie să blocheze integrarea?
7. CD este automat sau necesită aprobare manuală?

### Reguli implicite deja stabilite

- repository-ul este **privat implicit**; devine public numai prin decizie
  explicită;
- proiectele Node.js, Next.js și Expo noi folosesc **npm** implicit;
- `pnpm` se folosește numai dacă este cerut explicit sau este impus justificat
  de template/monorepo;
- backlink-ul este prezent implicit și se elimină dacă acordul sau clientul nu
  îl permite;
- pragurile Lighthouse implicite sunt cele din secțiunea 13.

---

## 4. Convenția de nume

Numele este lowercase, în engleză, `kebab-case`, scurt și stabil. Nu include
anul, versiunea, mediul sau tehnologia dacă acestea se pot schimba.

### Prefixe recomandate

| Prefix | Folosire | Exemplu |
|---|---|---|
| `web-` | website, landing page sau aplicație web generală | `web-evasione-fiscale` |
| `app-` | aplicație mobilă, desktop sau client instalabil | `app-fleetkeeper` |
| `blog-` | blog sau publicație editorială | `blog-tool` |
| `tool-` | utilitar online cu o funcție principală | `tool-file-transfer` |
| `lab-` | cercetare, experimente și reproducibilitate | `lab-qca-lab` |
| `api-` | serviciu API independent | `api-document-validation` |
| `cli-` | aplicație command-line | `cli-data-cleaner` |
| `lib-` | bibliotecă reutilizabilă | `lib-fiscal-rules` |
| `data-` | pipeline sau produs de date | `data-company-intelligence` |
| `infra-` | infrastructură sau platform engineering | `infra-observability` |
| `docs-` | documentație independentă | `docs-product-handbook` |

Prefixe funcționale precum `crm-` sau `form-` pot fi folosite doar dacă descriu
mai clar produsul decât categoria tehnică și sunt aprobate înainte de creare.

### Reguli

- nu crea nume redundante precum `web-website-*` sau `app-mobile-app-*`;
- nu combina prefixe fără motiv, de exemplu `web-tool-*`;
- verifică atât GitHub, cât și `~/projects` înainte de creare;
- dacă repository-ul a fost redenumit, actualizează remote-ul clonei existente;
- nu crea o clonă duplicat doar pentru că remote-ul vechi redirecționează;
- o singură clonă este declarată canonică.

---

## 5. Metadata obligatorie pe GitHub

### 5.1 Descriere

Descrierea:

- începe cu un singur emoji specific produsului;
- spune ce face produsul și pentru cine;
- menționează stack-ul doar dacă aduce claritate;
- este o singură propoziție, fără marketing fals;
- diferențiază clar `planned`, `in development` și `built`;
- nu afirmă funcționalități care nu există.

Șablon:

```text
<emoji> <produsul și beneficiul principal>, <stadiul>, with <stack relevant>.
```

Exemple de emoji:

- 🌐 website general;
- 📱 aplicație mobilă;
- 📝 blog;
- 🛠️ tool general;
- 🔐 securitate/secrete;
- 📤 transfer fișiere;
- 🔳 QR;
- 🧪 laborator;
- 🧠 knowledge/evidence;
- 🧾 facturare;
- 📈 CRM/analytics.

### 5.2 Website

- completează homepage-ul dacă domeniul este cunoscut;
- proiectele personale folosesc de regulă `https://<slug>.alexjungean.com`;
- nu adăuga URL placeholder;
- actualizează URL-ul când produsul trece din preview în producție;
- verifică HTTPS, redirecturile și consistența `www`/non-`www`.

### 5.3 Topics

Adaugă topic-uri relevante din patru categorii:

1. tip produs: `web-app`, `mobile-app`, `blog`, `research`;
2. domeniu: `healthcare`, `invoicing`, `file-transfer`;
3. tehnologii reale: `nextjs`, `typescript`, `supabase`, `cloudflare-r2`;
4. calități: `privacy`, `accessibility`, `seo`, `responsive-design`.

Folosește lowercase și hyphen. Nu adăuga topic-uri pentru servicii doar
evaluate sau eliminate ulterior.

---

## 6. Crearea corectă în Ubuntu/WSL

### Calea canonică

Toate repository-urile noi se clonează în:

```text
/home/alex/projects/<repository>
```

Forma scurtă folosită în documentație:

```text
~/projects/<repository>
```

Distribuția este `Ubuntu-24.04`. Nu crea o clonă suplimentară lângă un
workspace Windows dacă repository-ul există deja în WSL.

### Preflight

```bash
wsl -d Ubuntu-24.04
cd ~/projects

REPO="tool-exemplu"

test ! -e "$REPO" || {
  echo "STOP: $HOME/projects/$REPO există deja."
  exit 1
}

gh repo view "AlexandruJungean/$REPO"
```

Dacă ultima comandă găsește deja repository-ul, verifică remote-ul și caută
clona existentă. Nu recrea și nu reclona automat.

### Crearea remote-ului

Repository privat, cu descriere și homepage:

```bash
gh repo create "AlexandruJungean/$REPO" \
  --private \
  --description "🛠️ Descriere clară și verificabilă." \
  --homepage "https://exemplu.alexjungean.com"
```

Dacă homepage-ul nu este stabilit, omite complet `--homepage`.

Adaugă topic-urile după creare:

```bash
gh repo edit "AlexandruJungean/$REPO" \
  --add-topic "nextjs" \
  --add-topic "typescript" \
  --add-topic "netlify" \
  --add-topic "supabase"
```

### Clonarea obligatorie prin SSH

```bash
cd ~/projects
git clone "git@github.com:AlexandruJungean/${REPO}.git"
cd "$REPO"
git remote -v
```

Remote-ul corect este:

```text
git@github.com:AlexandruJungean/<repository>.git
```

HTTPS nu se folosește pentru clonele noi. Dacă SSH eșuează, repară agentul sau
cheia SSH; nu schimba automat repository-ul la HTTPS.

Deschidere în Cursor:

```bash
cd ~/projects/<repository>
cursor .
```

`~/projects` rulează pe filesystem-ul Linux nativ și este locația de lucru,
nu doar o convenție de organizare. Nu inițializa proiectele noi sub `/mnt/c`;
accesul I/O pentru Node, Git și containere este semnificativ mai slab acolo.
Din Windows, fișierele pot fi accesate la:

```text
\\wsl.localhost\Ubuntu-24.04\home\alex\projects
```

---

## 7. Fișierele minime inițiale

Fiecare repository pornește cu:

```text
README.md
LICENSE
.gitignore
.cursorignore
.env.example              # numai dacă există variabile de mediu
IMPLEMENTATION-PLAN.md
START-PROMPT.md
docs/
  CURRENT-STATE.md
  ROADMAP.md
  ARCHITECTURE.md          # dacă proiectul depășește un site simplu
  SECURITY-AND-PRIVACY.md  # dacă procesează date sau fișiere
  BRANDING-AND-DESIGN-SYSTEM.md
  TESTING-AND-QUALITY.md
  DEPLOYMENT.md
```

### Antetul minim din README

Repository-urile recente din WSL folosesc un rezumat ușor de auditat:

```md
# Numele produsului

Tagline scurt și verificabil.

**Planned URL:** <https://subdomeniu.alexjungean.com>
**Local WSL path:** `~/projects/nume-repository`
**GitHub:** `git@github.com:AlexandruJungean/nume-repository.git`
**Status:** planning/documentation scaffold; application code is not started
```

După implementare, `Status` se actualizează; nu lăsa un produs live descris ca
plan și nu declara implementat ceva ce există numai în documentație.

Pentru proiecte Node:

```text
package.json
package-lock.json
.nvmrc sau engines.node
```

În `package.json`, folosește `"license": "SEE LICENSE IN LICENSE"` pentru
proiectele proprietary. `"UNLICENSED"` este acceptabil numai când motivul este
explicit și fișierul `LICENSE` rămâne sursa juridică.

Pentru proiecte cu Supabase:

```text
supabase/
  config.toml
  migrations/
  tests/
```

Pentru aplicații implementate, adaugă în funcție de risc:

```text
.github/workflows/ci.yml
netlify.toml
playwright.config.ts
lighthouserc.json
tests/
```

Nu crea workflow-uri care pretind că testează un proiect alcătuit numai din
documentație. Pentru un repository de planificare, scrie un ghid de activare CI
și activează pipeline-ul când există cod, manifest, lockfile și teste reale.

---

## 8. Protecția secretelor și `.cursorignore`

`.cursorignore` este obligatoriu în toate proiectele.

Șablon minim:

```gitignore
**/.env
**/.env.*
!**/.env.example
!**/.env.*.example
!**/.env.template

**/*.pem
**/*.p12
**/*.pfx
**/*.key
**/*.crt

private/
samples-private/
fixtures-private/
backups/
backups_database/

**/*.dump
**/*.bak
**/*.mt940
**/*.sta
**/*.camt.xml
```

Reguli suplimentare:

- păstrează aceleași secrete și în `.gitignore`;
- `.env.example` conține numai nume și valori demonstrative;
- nu pune tokenuri, parole sau chei reale în prompturi, terminal output,
  screenshot-uri, fixtures sau rapoarte de test;
- nu ignora migrațiile Supabase și codul necesar reproducerii proiectului;
- nu presupune că `.cursorignore` este un control absolut de securitate: un
  secret poate fi expus dacă este atașat explicit sau afișat în terminal;
- rulează secret scanning înainte de primul push și înainte de release.

---

## 9. Hosting și servicii de date

### Implicit pentru proiectele web noi

- **Netlify** pentru deploy previews și producție;
- **Supabase** pentru PostgreSQL, Auth, Realtime sau funcții de date când
  produsul chiar are nevoie;
- **Cloudflare R2** pentru imagini și fișiere când volumul, dimensiunea,
  retenția sau costul justifică object storage.

cPanel se folosește numai dacă proiectul/clientul îl cere explicit sau dacă un
site static existent trebuie livrat acolo.

### Supabase

- nu adăuga Supabase unui site static fără date persistente;
- folosește migrații versionate și tipuri TypeScript generate;
- activează RLS pe fiecare tabel dintr-o schemă expusă;
- scrie politici potrivite modelului real de acces;
- cheia `service_role`/secretă este exclusiv server-side;
- nu folosi `user_metadata` pentru autorizare;
- view-urile expuse trebuie să respecte RLS, de regulă prin
  `security_invoker = true`;
- testează izolarea între utilizatori/tenant-uri;
- verifică documentația oficială curentă înainte de implementare;
- nu crea și nu modifica proiectul Supabase remote fără aprobare explicită.

### Cloudflare R2

- bucket privat implicit;
- upload/download direct prin URL-uri semnate și cu durată scurtă;
- serverul este control plane și nu proxy pentru fișiere mari;
- metadata și autorizarea rămân în Supabase când arhitectura o cere;
- validează tipul, dimensiunea, numele și dreptul de acces;
- definește retenție, lifecycle cleanup și procedură de ștergere;
- nu activa resurse plătite sau DNS fără aprobare.

---

## 10. Docker și Kubernetes

### Folosește Docker când

- sunt necesare servicii locale reproductibile;
- aplicația are worker, queue, procesare media sau dependențe de sistem;
- este necesară paritate între local, CI și producție;
- un validator sau tool extern are o versiune care trebuie fixată;
- integrarea are nevoie de PostgreSQL/Supabase local sau alte containere.

Preferă:

```text
Dockerfile
compose.yaml
.dockerignore
```

Imaginea trebuie să fie minimă, non-root unde este posibil, cu versiuni fixate,
healthcheck și fără secrete incluse în layer-e.

### Folosește Kubernetes numai când

- există mai multe servicii care trebuie orchestrate;
- sunt cerute autoscaling, high availability, rolling deploys sau joburi
  distribuite;
- mediul țintă este deja Kubernetes;
- complexitatea operațională este justificată și aprobată.

Nu introduce Kubernetes pentru un site static, un Next.js simplu, un MVP mic
sau o aplicație Expo. Pentru experimente locale, poate fi folosit `kind`, dar
nu devine automat arhitectura de producție.

Decizia Docker/Kubernetes și motivul ei se consemnează în
`docs/ARCHITECTURE.md`.

---

## 11. Licență și proprietate intelectuală

### Regula implicită

Copiază și adaptează licența proprietary din:

```text
~/projects/web-evasione-fiscale/LICENSE
```

Titular implicit:

```text
Jungean-Herman Marius-Alexandru
```

Antet:

```text
PROPRIETARY SOFTWARE LICENSE

Copyright (c) <anul> Jungean-Herman Marius-Alexandru
All Rights Reserved.
```

Nu folosi `--license` din `gh repo create` pentru această licență custom.
Creează și verifică manual fișierul `LICENSE`.

### Proiecte pentru clienți

În lipsa unei instrucțiuni diferite:

- copyright-ul rămâne la Jungean-Herman Marius-Alexandru;
- clientul primește prin contract sau document separat drept total de utilizare
  comercială pentru proiectul livrat;
- grantul trebuie să identifice exact clientul juridic și proiectul;
- contractul stabilește drepturile de modificare, distribuire, sublicențiere,
  mentenanță, reutilizare și acces la repository;
- dacă s-a negociat proprietatea direct pe client, înlocuiește licența înainte
  de livrare și folosește numele juridic corect al clientului.

Există două modele locale distincte:

1. **Proprietary intern/personal** — model:
   `~/projects/web-evasione-fiscale/LICENSE`;
2. **Proprietary cu grant comercial specific clientului** — modele:
   `C:\Alex\Munca\Primaria Salonta\web-primaria-salonta\LICENSE` și
   `C:\Alex\Munca\Central Dental Clinic\web-central-dental-clinic\LICENSE`.

Pentru varianta client, nu adăuga doar o propoziție vagă. Identifică partea,
drepturile acordate, drepturile reținute, atribuirea, restricțiile și
terminarea. Contactul standard pentru licențiere este
`alex.jungean@gmail.com`.

Nu presupune că plata transferă automat proprietatea intelectuală. Pentru
formulări juridice finale, contractul validat are prioritate față de acest ghid.

---

## 12. Branding și backlink

### Proiect personal

Identitatea implicită este cea de pe `alexjungean.com`:

- fundal principal: `#222222`;
- negru/suprafață închisă: `#181818`;
- culoare brand: `#678b9e`;
- titluri: **Clash Display**;
- text: **Inter**;
- stil dark, premium, clar, cu spațiere generoasă și accente restrânse.

Un produs poate avea o culoare accent proprie, dar trebuie să rămână coerent cu
sistemul vizual personal.

Nu confunda:

- numele public: **Alexandru Jungean**;
- titularul implicit al copyright-ului:
  **Jungean-Herman Marius-Alexandru**;
- entitatea care facturează sau semnează contractul, care trebuie confirmată
  pentru fiecare proiect.

### Proiect pentru client

1. Dacă există branding, respectă-l și documentează token-urile.
2. Dacă nu există, creează mai întâi un brief și 1–3 direcții vizuale.
3. Nu începe UI-ul final înainte de aprobarea direcției.
4. Nu aplica automat brandingul personal unui client.

### Backlink

Pe website-uri publice, implicit:

```tsx
<p className="text-xs text-slate-400">
  Developed by{' '}
  <a
    href="https://alexjungean.com"
    target="_blank"
    rel="noopener noreferrer"
    className="transition-colors hover:text-white"
  >
    Alexandru Jungean
  </a>
</p>
```

Reguli:

- apare în footer-ul comun, pe toate paginile publice;
- rămâne vizibil pe mobil;
- nu folosește `nofollow`;
- pentru i18n se traduce numai `developedBy`; numele și URL-ul rămân identice;
- se adaugă un test pentru text, URL, `_blank` și `noopener noreferrer`;
- pentru client, se elimină dacă acordul sau clientul nu permite atribuirea;
- excepția se consemnează în documentația proiectului.

Referință existentă:

```text
C:\Alex\Munca\Primaria Salonta\web-primaria-salonta\
components\layout\footer.tsx
```

---

## 13. Standardul de calitate „INSANE”

„INSANE” nu înseamnă animații sau complexitate fără scop. Înseamnă că fiecare
decizie este verificabilă, produsul este robust, iar compromisurile sunt
documentate.

Ordinea dedicată de finalizare este:

1. structură și arhitectură;
2. design și accesibilitate;
3. SEO și GEO;
4. performanță;
5. security hardening;
6. release audit.

Securitatea, accesibilitatea și performanța nu se amână complet până la final.
Ele sunt aplicate din prima fază, iar etapele de mai sus reprezintă trecerile
finale, specializate.

### 13.1 Structură și arhitectură

- domenii și responsabilități clare;
- TypeScript strict sau echivalent;
- validare a configurației și environment variables;
- contracte de date explicite;
- erori, loading, empty states și retry definite;
- i18n, time zone, monedă și formate decise de la început;
- migrații reproductibile și date de test sintetice;
- operații sensibile atomice și idempotente;
- fără duplicare, dead code sau abstracții premature;
- README și arhitectură sincronizate cu implementarea;
- build curat de la un clone fresh.

### 13.2 Design și accesibilitate

- design system cu token-uri, componente și stări;
- responsive de la mobil la ecrane mari;
- navigare completă din tastatură;
- focus vizibil și ordine logică;
- WCAG 2.2 AA;
- contrast strict, fără dezactivarea globală a regulii;
- semantic HTML și ARIA numai unde este necesar;
- loading, empty, success, warning și error states;
- reduced motion și fără animații care blochează;
- conținut real, fără statistici/testimoniale inventate;
- verificare manuală, nu doar automată.

### 13.3 SEO

- title și meta description unice;
- canonical corect;
- sitemap și robots.txt;
- Open Graph și social preview;
- favicon și manifest unde este relevant;
- Schema.org valid și bazat pe informații reale;
- i18n cu `hreflang` când există limbi multiple;
- heading hierarchy și linkuri descriptive;
- redirects fără lanțuri;
- pagini legale și date de contact corecte;
- fără indexarea rutelor private, preview sau test.

### 13.4 GEO

- răspunsuri clare, concise și verificabile la întrebările utilizatorilor;
- entități, autori, organizații, produse și servicii identificate consecvent;
- date, surse, expertiză și responsabilitate editorială vizibile;
- FAQ numai pentru întrebări reale;
- structured data aliniat exact cu pagina;
- conținut original, actualizat și ușor de citat;
- linkuri interne care explică relația dintre subiecte;
- `llms.txt` poate fi evaluat, dar nu înlocuiește conținutul, SEO sau
  documentația accesibilă crawlerelor;
- nu face afirmații de vizibilitate AI fără măsurare.

### 13.5 Performanță

Praguri implicite Lighthouse pentru rutele publice reprezentative:

- Accessibility: **100**;
- SEO: **100**;
- Best Practices: **100**;
- Performance: **minimum 95** pe profil mobil.

Core Web Vitals țintă la percentila 75:

- LCP ≤ 2,5 s;
- INP ≤ 200 ms;
- CLS ≤ 0,1.

În plus:

- imagini responsive și dimensiuni explicite;
- formate moderne și compresie justificată;
- fonturi locale/subsetate și `font-display`;
- bundle analizat și bugete de dimensiune;
- caching și CDN corecte;
- fără scripturi third-party inutile;
- fără request-uri duplicate sau waterfall evitabil;
- teste pe conexiune și dispozitiv modest;
- excepțiile de la praguri au motiv, dovadă și issue/roadmap.

Lighthouse este un test de laborator. După lansare, validează și datele reale
din teren când sunt disponibile.

### 13.6 Securitate

- threat model pentru date, roluri, uploaduri și integrări;
- least privilege;
- RLS și teste negative de cross-tenant;
- secrete numai server-side;
- validare input/output și escaping contextual;
- CSP și security headers;
- protecție CSRF unde modelul de autentificare o cere;
- rate limiting și abuse controls;
- upload privat, allow-list, limite și URL-uri semnate;
- audit log pentru operații sensibile;
- dependency audit și secret scanning;
- backup, restore și retenție testate;
- niciun finding Critical sau High nerezolvat la release;
- finding-urile acceptate au owner, motiv și termen;
- nu afișa stack traces, secrete sau date personale în loguri.

---

## 14. Testare: Playwright, axe și Lighthouse

### Website / web app

Baseline recomandat:

- unit tests pentru logică;
- integration tests pentru contractele importante;
- Playwright pentru happy path și failure path;
- `@axe-core/playwright` cu WCAG AA strict;
- Lighthouse CI pentru rutele publice;
- teste pentru light/dark și viewport-uri relevante;
- production build în CI.

Nu accepta un scan axe global cu `color-contrast` dezactivat. Orice excepție
trebuie să fie punctuală, justificată și temporară.

### Aplicație Expo/React Native

Lighthouse nu este un validator relevant pentru UI-ul nativ. Folosește:

- Jest;
- React Native Testing Library;
- Expo Doctor;
- `expo install --check`;
- Maestro pentru fluxuri E2E;
- verificări manuale VoiceOver/TalkBack și dimensiuni de text.

### Alte stack-uri

Alege echivalentul specific limbajului: lint, typecheck/static analysis, unit,
integration, security scan și build/package reproducibil.

---

## 15. CI/CD

### Când se adaugă

Pentru orice repository cu aplicație executabilă, CI este baseline, nu
opțional. CD se activează când există un mediu real de deploy.

Pentru documentație/planificare fără cod:

- nu crea un CI fals;
- documentează pipeline-ul viitor;
- definește criteriul exact de activare.

### Runtime-ul intern al GitHub Actions

Înainte de crearea sau activarea unui workflow, verifică release-ul oficial
curent și confirmă în `action.yml` că acțiunea folosește
`runs.using: node24`. Baseline-ul minim aprobat în august 2026 este:

- `actions/checkout@v7`;
- `actions/setup-node@v7` pentru proiecte Node;
- `astral-sh/setup-uv@v10` pentru proiecte Python/uv;
- `gitleaks/gitleaks-action@v3` când se folosește Gitleaks.

`node-version` configurează runtime-ul aplicației și este independent de
runtime-ul intern Node 24 al acțiunii. Nu folosi
`ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION` și nu copia exemple cu action majors
vechi. După activare, configurează Dependabot pentru ecosistemul
`github-actions`.

### Pipeline web recomandat

1. checkout;
2. Node/npm fixat;
3. `npm ci`;
4. lint;
5. typecheck;
6. unit/integration tests;
7. production build;
8. Playwright + axe;
9. Lighthouse CI;
10. dependency/security scan;
11. Netlify Deploy Preview pentru pull request;
12. producție din `main` numai după verificările obligatorii.

Folosește lockfile-ul. Nu instala versiuni inventate și nu permite CI-ului să
rezolve dependențe flotante.

### Branch și release

- `main` trebuie să rămână deployabil;
- fazele mari folosesc branch-uri și pull request când riscul justifică;
- proiectele client/producție folosesc review și checks obligatorii;
- deploy-ul cu risc sau cost poate necesita aprobare manuală;
- migrations și deploy trebuie ordonate și să aibă rollback/restore plan;
- commit și push se fac numai când utilizatorul cere explicit.

---

## 16. Documentație și handoff între conversații AI

O conversație foarte lungă scade precizia și consumă inutil context. După
fiecare batch sau fază majoră:

1. oprește implementarea într-un punct stabil;
2. rulează verificările relevante;
3. actualizează documentația;
4. notează exact ce este implementat și ce nu;
5. creează/actualizează promptul pentru o conversație nouă;
6. continuă în Cursor AI sau Claude Code într-o conversație separată.

### Fișiere recomandate

```text
IMPLEMENTATION-PLAN.md
START-PROMPT.md
CONTINUE-PROMPT.md
docs/CURRENT-STATE.md
docs/ROADMAP.md
docs/DECISIONS/
```

### `docs/CURRENT-STATE.md` trebuie să includă

- data actualizării;
- branch și ultimul commit relevant;
- fazele finalizate;
- funcționalitățile și limitele reale;
- fișiere/migrații importante;
- comenzi executate și rezultate;
- teste care trec/eșuează;
- blockers locali și externi;
- resurse remote create sau încă necreate;
- exact următorul pas.

### `CONTINUE-PROMPT.md` trebuie să includă

- scopul produsului;
- calea locală `~/projects/<repository>`;
- stack și constrângeri invariabile;
- documentele care trebuie citite mai întâi;
- starea implementată, bazată pe dovezi;
- lucrurile explicit în afara scope-ului;
- task-ul concret pentru următoarea conversație;
- verificările obligatorii;
- interdicția de a inventa secrete, rezultate sau funcționalități;
- regula de a nu crea commit fără cerere explicită.

Documentația trebuie actualizată în același batch cu schimbarea pe care o
descrie. Un handoff vechi este mai periculos decât lipsa lui.

---

## 17. Ordinea recomandată a unui proiect nou

### Faza 0 — Discovery

- răspunsuri la întrebările obligatorii;
- competitor/research audit;
- personal vs comercial propriu vs client;
- ownership, licență, branding și backlink;
- MVP, non-goals și criterii de acceptare;
- riscuri, date și costuri.

### Faza 1 — Repository și fundație

- nume, descriere, homepage și topics;
- repository privat;
- clonă SSH în `~/projects`;
- LICENSE, README, `.gitignore`, `.cursorignore`;
- plan, roadmap, current state și start prompt;
- stack și architecture decision;
- scaffold, lockfile, env validation;
- CI baseline.

### Faza 2 — Vertical slice

- un flux complet, mic și real;
- date sintetice;
- happy path + failure path;
- accesibilitate și securitate de bază;
- deploy preview;
- validarea arhitecturii înainte de extindere.

### Faza 3 — MVP

- toate fluxurile aprobate;
- erori și stări complete;
- teste de business;
- integrarea serviciilor aprobate;
- observabilitate minimă;
- documentație actualizată.

### Faza 4 — Hardening „INSANE”

În această ordine:

1. structură;
2. design/accesibilitate;
3. SEO/GEO;
4. performanță;
5. securitate;
6. release audit.

### Faza 5 — Release

- toate verificările verzi;
- licență și drepturi confirmate;
- backup/restore;
- domeniu, DNS și TLS;
- environment variables;
- pagini legale și consent;
- analytics/monitoring aprobate;
- metadata GitHub actualizată;
- README și handoff finale;
- plan post-launch și responsabil de mentenanță.

---

## 18. Checklist compact

### Înainte de creare

- [ ] Scop, public și MVP clarificate
- [ ] Personal / comercial propriu / client stabilit
- [ ] Ownership și drepturi comerciale stabilite
- [ ] Branding existent sau direcție nouă stabilită
- [ ] Backlink aprobat sau excepție documentată
- [ ] Nume și prefix validate
- [ ] Vizibilitate stabilită
- [ ] Domeniu/homepage stabilit sau marcat necunoscut
- [ ] Stack, date, fișiere, costuri și compliance clarificate
- [ ] Docker/Kubernetes motivate sau respinse explicit

### La creare

- [ ] Repository privat creat cu descriere emoji
- [ ] Homepage completat dacă este real
- [ ] Topics relevante adăugate
- [ ] Verificată inexistența unei clone duplicate
- [ ] Clonat prin SSH în `~/projects`
- [ ] Remote-ul este `git@github.com:...`
- [ ] LICENSE proprietary sau licența client aprobată
- [ ] `.gitignore` și `.cursorignore`
- [ ] `.env.example` fără secrete
- [ ] README + plan + current state + roadmap + start prompt
- [ ] Lockfile și versiune runtime
- [ ] CI planificat/implementat corect

### Înainte de release

- [ ] Scope și documentație sincronizate
- [ ] Structură finală auditată
- [ ] Design și WCAG 2.2 AA auditate
- [ ] SEO și GEO auditate
- [ ] Lighthouse 100/100/100 și Performance ≥95 sau excepții documentate
- [ ] Core Web Vitals în ținte sau plan de remediere
- [ ] Security hardening și dependency audit
- [ ] Zero Critical/High nerezolvat
- [ ] RLS și izolarea tenant testate, dacă există Supabase
- [ ] Upload/retention testate, dacă există R2
- [ ] Docker/Kubernetes scanate și documentate, dacă există
- [ ] Netlify preview și production verificate
- [ ] Domeniu, TLS, redirects și headers verificate
- [ ] Licență, backlink și pagini legale verificate
- [ ] `CURRENT-STATE.md`, `ROADMAP.md` și `CONTINUE-PROMPT.md` actualizate
- [ ] Metadata GitHub reflectă stack-ul și hostingul reale

---

## 19. Reguli pentru agentul AI

Agentul trebuie:

- să întrebe când informația lipsește;
- să verifice repository-urile și clonele existente înainte de creare;
- să nu creeze resurse plătite, DNS, Supabase, R2 sau deploy fără aprobare;
- să nu citească sau afișeze secrete;
- să nu schimbe stack-ul sau package manager-ul fără motiv aprobat;
- să nu introducă Docker/Kubernetes doar pentru impresie;
- să nu inventeze versiuni de dependențe;
- să nu inventeze testimoniale, statistici, certificări sau rezultate;
- să nu declare un test trecut fără să-l ruleze;
- să nu confunde documentația planificată cu implementarea existentă;
- să păstreze modificările utilizatorului și să evite fișierele fără legătură;
- să actualizeze handoff-ul după fiecare fază mare;
- să propună o conversație nouă când contextul devine prea mare;
- să raporteze dovezi: fișiere, comenzi, rezultate și blockers;
- să facă commit/push numai la cererea explicită a utilizatorului.

Dacă o alegere poate afecta costuri, securitate, proprietate intelectuală,
datele clientului, arhitectura sau rezultatul vizual, întrebarea este
obligatorie înainte de acțiune.

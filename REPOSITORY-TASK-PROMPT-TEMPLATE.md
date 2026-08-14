# Repository task prompt template

Folosește acest șablon când deschizi o conversație nouă pentru un task într-un
repository din portofoliu. Înlocuiește toate valorile dintre `<...>` și șterge
secțiunile care nu se aplică.

```text
Lucrăm în repository-ul:
- GitHub: https://github.com/AlexandruJungean/<repository>
- Cale locală: <calea locală canonică>
- Branch implicit: <main/master>

Task:
<descriere concretă și verificabilă>

Rezultat așteptat:
<ce trebuie să existe sau să funcționeze la final>

În scope:
- <fișiere/funcționalități permise>
- <teste/documentație care trebuie actualizate>

În afara scope-ului:
- <fișiere/servicii pe care nu trebuie să le atingi>
- fără refactorizări sau upgrade-uri fără legătură

Constrângeri:
- Citește mai întâi README, documentația de stare/arhitectură/securitate și
  workflow-urile existente.
- Verifică `git status`, branch-ul, remote-ul și starea CI înainte de editare.
- Păstrează toate modificările locale existente și nu suprascrie munca mea.
- Nu citi, afișa, copia sau inventa valori din `.env`, secrets, tokenuri,
  credentiale, dump-uri, date personale ori date de producție.
- Nu folosi servicii sau baze de date de producție în teste.
- Nu modifica GitHub settings, Netlify, Supabase, R2, DNS, EAS sau alte resurse
  remote fără aprobarea mea explicită.
- Nu face commit, push, merge, release sau deploy fără cererea mea explicită.
- Nu dezactiva teste, reguli de accesibilitate ori controale de securitate doar
  pentru a obține un rezultat verde.
- Folosește package manager-ul și lockfile-ul existente; nu introduce
  dependențe sau versiuni flotante fără justificare și verificare.

Date și securitate:
- Clasificarea datelor: <publice/sintetice/confidențiale/personale/licențiate>
- Secrete necesare: <niciunul / doar numele variabilelor, fără valori>
- Operații sensibile: <auth/RLS/upload/crypto/email/plăți/migrații/altele>
- Threats obligatoriu de testat: <enumerare scurtă>

CI/CD:
- Rulează verificările existente relevante și păstrează joburile fără
  credențiale de producție.
- Pentru un repository fără cod, nu crea application CI/CD până nu există cod,
  manifest, lockfile, scripturi executabile, fixtures sintetice și teste locale
  verzi.
- Pentru modificări de workflow: permisiuni minime, actions pin-uite la commit
  SHA, `persist-credentials: false`, runner fixat, timeout și concurrency.
- Nu activa CD dacă branch protection, environment approval, rollback și
  promovarea artefactului testat nu sunt demonstrabile.

Criterii de acceptare:
- [ ] <criteriu funcțional>
- [ ] <criteriu de securitate>
- [ ] <test/comandă care trebuie să treacă>
- [ ] documentația reflectă exact starea implementată
- [ ] diff-ul final conține numai schimbările din scope

Mod de lucru:
1. Analizează repository-ul și explică pe scurt constatările/blocker-ele.
2. Dacă lipsește o decizie cu impact de securitate, cost, date sau arhitectură,
   întreabă înainte de implementare.
3. Implementează schimbarea minimă completă.
4. Rulează verificările proporționale cu riscul.
5. Raportează fișierele schimbate, comenzile și rezultatele reale; nu declara un
   test trecut dacă nu a fost rulat.
```

## Adaos pentru un task de remediere CI

Adaugă la prompt:

```text
Nu schimba aplicația doar ca să compensezi un workflow greșit. Separă clar:
- defectul aplicației;
- defectul pipeline-ului;
- limitarea GitHub/hosting;
- finding-ul de securitate preexistent.

Oprește rollout-ul dacă apare un secret real, un finding Critical, acces la
producție sau un test roșu. Raportează informația sanitizat, fără valoarea
secretului și fără loguri sensibile.
```

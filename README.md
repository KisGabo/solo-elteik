# Solo játék

**Egyéb leírások a docs mappában**

## Telepítés

1. `git clone https://github.com/kisgabo/solo-elteik`
2. `npm i`
3. A kliens indítása egyelőre: `npm run dev`
  - Ezután a böngészőben a *localhost:8080* cím alatt érhető el.
  - Ha a *client* mappában lévő fájlt változtatsz, automatikusan újratöltődik az oldal a böngészőben (ha mégsem, akkor frissíts).
  - A kliens leállítása: CTRL+C

## Fájlok, könyvtárak

- `client`: Minden ami a kliens app
  - `public`: Ebből a mappából szolgálja ki majd a webszerverünk a HTML-t, szkripteket, képeket, stb.
    - `compiled`: Ezzel nem kell foglalkozni, ide kerülnek a lefordított fájlok automatikusan, egyelőre csak a kombinált javascript fájl
    - `images`: Képek, pl. a kártyáké, bármilyen kép, ami kell a klienshez
    - `index.html`: Az egyetlen HTML fájl, amit a böngésző letölt; minden mást szkriptek végeznek
  - `view`: Szorosan az UI-val kapcsolatos szkriptek
    - `boot.js`: Egy függvény, ami lefut, miután betöltött az index.html
    - `gameEvents.js`: Interfész, az ebben lévő függvények hívódnak, ha történik valami az appban
  - `main.js`: A legelsőként lefutó szkript a böngészőben, összeheggeszt egy-két dolgot az induláshoz
  - `remoteActions.js`: Interfész, a view ezeket hívhatja
- `server`: Minden ami szever
  - `model`: Játék logika
- `test`: A rendes, beadásra kerülő tesztfájlok, amiket mochával tudunk futtatni

## Git

Kezdetben mehet minden a master ágra szerintem. Amikor már nagyjából öszeállt egy használható "prototípus", akkor az új, nagyobb módosítások / fejlesztések mehetnek külön ágon.

**A commit üzenetek** legyenek magyarok, és írjuk nagy kezdőbetűvel őket.

**Minden fájl egy üres sorral végződik.**

**Mielőtt felpusholnád githubra az új munkádat, ne simán `git pull`-t használj, hanem `git pull --rebase`-t!** Tehát pusholni nem érdemes olyan sűrűn, csak nap végén, vagy ha kifejzetten publikálni akarod a munkád már.

**Ne commitolj személyes beállításfájlokat (pl .vscode), inkább írd be ezeket a `.gitignore`-ba!**

## Stílus

**Kövessük a következő konvenciókat:**
- 2 szóközös behúzások
- kulcsszavak (if, function...) és a nyitó zárójel közé szóköz: `if (valami)`
- a stringeket 'aposztrófok' közé (kivéve persze a JS template stringeket)
- 1TBS zárójelezés, azaz:
```
if (valami) {
  // ...
} else {
  // ...
}
```
- nem használunk pontosvesszőket
- egy osztályban a privátnak szánt függvények és változók neve elé `_`

## Tesztelés

Szerintem a "hivatalos" teszteket írjuk [Mocha](https://mochajs.org/) tesztelő keretrendszerben, és használjuk hozzá az általános [Chai](http://chaijs.com/) assertion libet. Meg ami még kell, egyéb tesztekhez.

Ilyen teszteket nem muszáj már most írni, csak ha van rá időtök és tudjátok hogy kell. Én sem vagyok még otthon annyira ebben. Viszont ez egy jó és szép módszer a kód tesztelésére fejlesztés közben.

De tesztelhettek úgy ahogy jól esik, például teszt célú sorokat írtok a kódba, console.logoltok, stb. Esetleg (pl. a szerver modell osztályokhoz) írsz egy külön js fájlt, amiben használod az osztályt, és futtatod: `node test.js`. A viewnél pl. a szervertől jövő infókat lehet szimulálni (amíg nincs kész a szerver) a gameEvents.js függvényeinek "kézi" meghívásával.

## Build

Megoldom, most nincs erőm leírni :D

## Doksi

**Doksi generálásra** majd [JSDoc](http://usejsdoc.org/)-ot használunk. Egyelőre nem kell követni a megkövetelt kommentelési formáját, ha nem akarjátok már most rögtön áttanulmányozni (egyébként nem bonyolult), a projekt végén át lehet írni a kommenteket a megfelelő formába. A lényeg, hogy valamilyen módon kommenteljétek a kódot (főleg magukat a függvényeket, osztályokat, változódefiníciókat, fájlokat).

Egyéb doksit megbeszéljük.

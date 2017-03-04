# Szerver interfész

## Socket.IO

**Szerver-kliens kommunikáció:** Kétirányú, eseményvezérelt, *[socket.io](https://socket.io/)* használatával

Lényege, hogy miután a kliens felcsatlakozott a szerverre, mindketten küldhetnek egymásnak adatot bármikor, amit a másik rögtön meg is kap.

Egy küldött adatnak (vagy eseménynek, eventnek) van egy típusa (pl. 'draw'), és mellé opcionálisan lehet csatolni akármilyen adatot, például egy JS objektumot mindenféle információval.

**Kliensoldalon ennyit kell tudni az alkalmazásához:**

```javascript
const socket = getSocket() // valahonnan elkérjük a kommunikációs csatornánkat

// szervertől jövő események figyelése:

socket.on('esemény', function (adat) {
  // ez lefut, ha jön egy 'esemény' a szervertől
})

socket.on('másikesemény', function (adat) {
  // ez lefut, ha jön egy 'másikesemény' a szervertől
})

// szerver felé esemény küldése (event emit):

const adat = { valami: 'szia', valami2: 'na' }
socket.emit('történés', adat)
```

## Események

### Kliens --> szerver

- **connect**: játékos neve
- **disconnect**
- **place**: `{ cardId: ..., info: ... }`
   Kártya lerakása. Az info egy szín, ha színváltós kártyalapot tesz le, illetve egy játékos neve kártyacsere lap esetén; üres string, ha nem akar cserélni. A szerver ezután egy *cardPlaced* eseményt küld el mindenkinek.
- **draw**:
   A kliens nem tud rakni, így húznia kell. A szerver ezután egy *drawn* eseményt küld el mindenkinek.

### Szerver --> kliens

- **playerConnected**: `{ name: ..., id: ... }`
   Ha egy játékos csatlakozott várakozás közben (neve és sorszáma)
- **playerDisconnected**: `playerId`
   Ha egy játékos lecsatlakozott várakozás vagy játék közben. Egyelőre ha játék közben lecsatlakozik valaki, akkor a játék simán folytatódik a lecsatlakozott játékos kitörlésével.
- **started**: `{ cards: [...], firstCard: ... }`
   Megvan mindenki, indul a játék, az 1-es sorszámú játékos kezd. A cards a kliensnek osztott lapok, a firstCard meg a kezdő lap.
- **cardPlaced**: `{ card: ..., playerId: ..., info: ..., newCards: [...] }`
   Valaki (playerId) lerakott egy lapot (card). Az info ugyanaz, mint feljebb a place-nél. A newCards tömbben vannak a klienshez kerülő új kártyalapok, ha a klienst érintő csere történt. Ez az esemény annak a kliensnek is elmegy, aki épp a lapot rakta.
- **drawn**: `{ numOfCards: ..., playerId: ..., drawnCards: [...] }`
   Valaki (playerId) kártyalapo(ka)t húzott fel a pakliból, pontosan numOfCards darabot. A drawnCards tömbben vannak a felhúzott kártyalapok, ha maga a kliens húzott.
- **illegalAction**:
   Rossz kártyalapot rakott a kliens, vagy rosszkor akart húzni. Ez csak annak a kliensnek megy el, aki hibázott.

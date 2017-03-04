#Terv

## Egy kártyalap reprezentálása

```
{
  color: '...',
  type: '...',
  number: ...
}
```

**color** lehetséges értékei:
- `red`
- `green`
- `blue`
- `yellow`
- üres string, ha színválasztó lapról van szó

**type** lehetséges értékei:
- `number` (szám)
- `draw2` (húzz kettőt)
- `reverse` (irányváltoztatás)
- `skip` (kimarad)
- `swap` (kártyacsere)
- `circular` (körkörös kártyacsere)
- `wild` (színválasztó)
- `draw4wild` (húzz négyet és színválasztás)

**number** lehetséges értékei (feltéve ha `type=='number'`):
- 0-tól 9-ig

## CardDeck osztály

A lefordított, esetleg megkevert kártyapakli. Ebből fognak a játékosok a játék elején kártyákat kapni, és ebből húznak a játék során.

- `draw()`: pakli tetejéről a következő kártyalapot adja vissza (és le is veszi a pakliról)
- `count()`: hány kártyalap van még a pakliban
- `reset()`: az összes kártya visszakerül a pakliba

Várható használat kb:
```javascript
const deck = new CardDeck()
const c1 = deck.draw()
const c2 = deck.draw()
// ...
if (deck.count() === 0) {
  deck.reset()
}
deck.draw()
// ...
```

## SoloGame osztály

A játékmenet modell. A játékosok egy sorszámmal vannak azonosítva. Egy játékosnak a kártyalapjai a tömbbeli indexszel vannak azonosítva (ez a cardId).

- `constructor(numOfPlayers, cardDeck)`: új játék adott számú játékossal (oszt a pakliból, első lap lerak)
- `canBePlaced(card, playerId)`: le lehet-e tenni az adott kártyalapot az adott sorszámú játékos által (true/false)
- `place(cardId, playerId, info)`: leteszi a kártyalapot az adott sorszámú játékos (az info egy szín, ha színváltós kártyalapot tesz le, illetve egy játékos sorszáma kártyacsere lap esetén; -1 ha nem akar cserélni)
- `draw()`: a soron következő játékos nem tud vagy nem akar tenni, ezért húz a pakliból egyet (vagy kettőt, négyet, nyolcat, attól függően, hogy volt-e lerakva az előbbiekben húzós kártya); visszaadja a felhúzott lapok tömbjével (akkor is tömb, ha csak egy)
- `getCurrentCard()`: a legutóbbi lerakott kártyalap
- `getNextPlayer()`: a soron következő játékos sorszáma
- `getDirection()`: a játék jelenlegi iránya (true: előre (1,2,3,1,2,3,...), false: hátra (3,2,1,3,2,1,...))
- `getPlayerCards(playerId)`: adott játékos kártyalapjait visszaadja tömbben
- `hasEnded()`: vége a játéknak?
- `removePlayer(playerId)`: kiveszi a játékost a játékmenetből (tehát mindig átugorjuk őt; a játékosok sorszámai ne változzanak meg!)





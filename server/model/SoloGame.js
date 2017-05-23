var CardDeck = require('./CardDeck.js');

/**
 * Egy kártyalapot reprezentáló struktúra
 * @typedef {Object} Card
 * @property {string} color A kártya színe (red, green, blue, yellow, vagy üres string)
 * @property {string} type Típus: number, draw2, reverse, skip, swap, circular, wild, draw4wild
 * @property {number} [number] Számkártya esetén a szám (1-9)
 */

/**
 * A játákmenet logikája.
 * @module Server/Model
 * @author Biró Ádám
 */
 class SoloGame {

    /**
     * Konstruktor - egyetlen paramétert vár, amely a játékosok száma, amellyel inicializálja a belső változóját.
     * A játékosok száma nincs ellenőrizve - ennek [2 és 10] között kell lennie.
     * 
     * A kártyapaklit reprezentáló _deck változó egy CardDeck típusú objektum, amely a konstruktor
     * hívásakor példányosítódik. 
     * Létrehoz kétdimenziós tömböt (_players), amely a játékosok lapjait tárolja. A játékosokat a tömbbeli 
     * indexük azonosítja (0 .. numOfPlayers-1).
     * 
     * Ezután végrehajtódik az osztás: a _deck mezőnek  8*numOfPlayers alkalommal meghívódik a draw() metódusa, 
     * ezzel mindegyik játékos kap egyenként 8 lapot (egyesével, sorban). Végül egy újabb húzás történik, 
     * az így kapott lapott - és később a kijátszott lapok közül a legfölsőt - a _topCard változó tárolja.
     * 
     * A játék irányít az _originalDirection változó tárolja, amely kezdetben true értékűre állítódik. 
     * Később irányváltásokor mindig az előző érték ellentetjére válzotik.
     *  
     * Az  _onTurn változó tárolja, hogy melyik játékos van soron. Ez kezdetben 0, egy lap kijátszásakor 1-el nő, 
     * ha az _originalDirection == true, különben 1-el csökken (modulo numOfPlayers).
     * 
     * A _playedCards tömb tartja nyilván a kijátszott lapokat.
     * Az _wantedColor string tárolja, hogy színkérés után milyen színt kell tenni. Ha nem volt színkérés, akkor üres sting
     * A _cardsToDraw változó tárolja kummulálva azt, hogy mennyit kell felhúznia annak a játékosnak, 
     *      akit DRAW2 vagy DRAW4WILD büntet. Ha ilyenről nincs szó, akkor az értéke 0! 
     * A _removedPlayers[] tömb tárolja a (removePlayer() hatására) kilépett játékosokat - 
     *                      a kilépett sorszámú eleme true, a többi false.
     * 
     * @param {CardDeck} deck A kártyapakli
     * @param {number} numOfPlayers - A játékosok száma, a [2, 10] intervallumba kell esnie.
     */
        constructor(deck, numOfPlayers){
        
        /**
         * @member {number} Játékosok száma
         * @private
         */
        this._numOfPlayers = numOfPlayers

        /**
         * @member {CardDeck} Kártyapakli
         * @private
         */
        this._deck = deck

        /**
         * @member {boolean} Játék iránya (true: előre, false: hátra)
         * @private
         */
        this._originalDirection = true

        /**
         * @member {number} Következő játékos sorszáma
         * @private
         */
        this._onTurn = 0

        /**
         * @member {Card[]} Kijátszott lapok
         * @private
         */
        this._playedCards = []

        /**
         * @member {Card[][]} Játékosok lapjai
         * @private
         */
        this._players = []//new Array(this._numOfPlayers).fill( new Array() )        
        
        /**
         * @member {string} A legutóbb lerakott színváltó kártyalap kért színe
         * @private
         */
        this._wantedColor = ''

        /**
         * @member {number} Következő húzáskor hány lapot kell felhuzatni a játékossal
         * @private
         */
        this._cardsToDraw = 0

        /**
         * @member {boolean[]} Lecsatlakozott-e az adott indexű játékos
         * @private
         */
        this._removedPlayers = []        
        
        for (let i = 0; i < this._numOfPlayers; i++){
            this._players[i] = []
            this._removedPlayers[i] = false            
        }

        
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < this._numOfPlayers; j++){
                this._players[j].push(this._deck.draw())
            }
        }
        
        do {
            this._topCard = this._deck.draw()
            this._playedCards.push(this._topCard)
        } while (this._topCard.type !== 'number')        
        
    }


    /**
     * Igazat ad vissza, ha a card által jelölt lapot a playerId által jelölt sorszámú játékos szabályosan kijátszhatja, 
     * beleértve a közbedobást is. Különben hamisat.
     * 
     * A card-nak így kell kinéznie:
     *  {
     *   color: '...',   // red, green, blue, yellow, ''
     *   type: '...',    // number, draw2, ...
     *   number: ...     // 1-9, ha számozott a lap
     *   }
     *
     * 
     * @param {Card} card - A lap, amit valaki le szeretni tenni
     * @param {number} playerId - Annak a játékosnak a sorszáma, aki tenni szeretné  (0 .. numOfPlayers-1)
     * @return {boolean}
     */
    canBePlaced(card, playerId){   
         // leellenőrzi, hogy az adott játékosnak van-e egyáltalán ilyen kártyája - console-beli hack-ek elkerülése miatt
        // var b = false
        // for (let i = 0; i < this._players[playerId].length; i++){
        //     if (this._players[playerId][i].color == card.color){
        //         if (this._players[playerId][i].type == card.type){
        //             if (this._players[playerId][i].number == card.number){
        //                 b = true
        //             }
        //         }
        //     }
        // }
        // if (!b){
        //     return false
        // }

        // közbedobás ellenőrzése. Bármelyik játékos - akár a legutoljára dobó is-, aki birtokolja az utoljára dobott
        // lapot, soron kívül bedobhatja.
        if (card.type == 'number' && this._topCard.color === card.color && this._topCard.number === card.number){
            return true
        }      

        // ha nem közbedobásról van szó és nem is a soron következő játékos dobna, akkor return false
        if (this._onTurn != playerId){
            return false
        }       

       
        // ha húzni kéne a játékosnak, akkor csak megfelelő lapokat tehet
        if (this._cardsToDraw > 0) {
            return card.type === 'draw4wild' || this._topCard.type === 'draw2' && card.type === 'draw2' && this._topCard.color === card.color
        }

        // circularra bármi jöhet
        if (this._topCard.type === 'circular') {
            return true
        }

        // bármikor kijátszható lapok
        if (card.type === 'wild' || card.type === 'draw4wild' || card.type === 'circular') {
            return true
        }

        // kért színre csak a kért színt
        if (this._wantedColor) {
            return this._wantedColor === card.color
        }

        // ha a szín egyezik, már oké
        if (this._topCard.color === card.color) {
            return true
        }

        // szám egyezés esetén oké
        if (this._topCard.type === 'number' && this._topCard.number === card.number) {
            return true
        }

        // akciókártya típusának egyezése esetén oké
        if (card.type !== 'number' && this._topCard.type === card.type) {
            return true
        }

        return false
    }


    /**
     * A playerId sorszámú játékos cardId sorszámú lapját kijátsza.
     * (az info egy szín, ha színváltós kártyalapot tesz le, illetve egy játékos sorszáma kártyacsere lap esetén;
     *  -1 ha nem akar cserélni)
     * Az adott sorszámú lapot kiveszi az adott sorszámú játékos lapjai közül és beteszi a kijátsztott lapokhoz.
     * 
     * @param {number} cardId - A dobó játékos cardId sorszámú lapja 
     * @param {number} playerId - A dobó játékos sorszáma
     * @param {string} info -egy szín, ha színváltós kártyalapot tesz le, 
     *                      illetve egy játékos sorszáma kártyacsere lap esetén; -1 ha nem akar cserélni
     *                      'sima' (type == 'number') esetén üres string
     */
    place(cardId, playerId, info){
        const card = this._players[playerId][cardId]

        this._topCard = this._players[playerId].splice(cardId, 1)[0]
        this._playedCards.push(this._topCard)

        switch (card.type){
            case 'number': 
                this._wantedColor = ''
                this._cardsToDraw = 0
                // csak numbert lehet közbedobni, így itt megadjuk a `from` paramétert is
                 this._stepToNext(1, playerId)
                break
            case 'reverse':                
                this._originalDirection = !this._originalDirection
                this._wantedColor = ''
                this._cardsToDraw = 0
                this._stepToNext(1)
                 break
            case 'skip':
                this._wantedColor = ''
                this._cardsToDraw = 0
                this._stepToNext(2)
                break
            case 'draw2':
                this._cardsToDraw += 2
                this._stepToNext(1)
                break
            case 'swap':
                let i = parseInt(info)
                if (info != -1){
                    let temp = this._players[i]
                    this._players[i] = this._players[this._onTurn]
                    this._players[this._onTurn] = temp
                }
                this._wantedColor = ''
                this._cardsToDraw = 0
                this._stepToNext(1)
                break
            case 'circular':                
                if(this._originalDirection){
                    let temp = this._players[this._numOfPlayers-1]
                    for (let i = this._numOfPlayers-1; i > 0 ; i-- ){
                        this._players[i] = this._players[i-1]
                    }
                    this._players[0] = temp
                } else {
                    let temp = this._players[0]
                    for (let i = 0; i < this._numOfPlayers-1; i++ ){
                        this._players[i] = this._players[i+1]
                    }
                    this._players[this._numOfPlayers-1] = temp
                }
                this._cardsToDraw = 0
                this._stepToNext(1)
                break
            case 'draw4wild':
                this._cardsToDraw += 4
                this._wantedColor = info
                this._stepToNext(1)
                break            
            case 'wild':
                this._cardsToDraw = 0
                this._wantedColor = info
                this._stepToNext(1)
                break     

        }

    }


    /**
     * A soron következő játékos nem tud vagy nem akar tenni, ezért húz a pakliból egyet 
     * (vagy kettőt, négyet, nyolcat, attól függően, hogy volt-e lerakva az előbbiekben húzós kártya).
     * @return {Card[]} A felhúzott lapok tömbje (akkor is tömb, ha csak egy).
     */
    draw(){
        let toDraw = []
        if (this._cardsToDraw == 0){
            toDraw.push(this._deck.draw())
            if (this._deck.count() == 0){
                this._shuffleDeck()
            }
        } else {
                for (let i = 0; i < this._cardsToDraw; i++){
                    toDraw.push(this._deck.draw())
                    if (this._deck.count() == 0){
                    this._shuffleDeck()
                }
            }
        }
        this._players[this._onTurn].push(...toDraw)
        this._cardsToDraw = 0
        this._stepToNext(1)
        return toDraw
    }


    /**
     * @return {Card} A legutóbbi lerakott kártyalapot adja vissza
     */
    getCurrentCard(){
        return this._topCard
    }


    /**
     * @return {number} A soron következő játékos sorszámát adja vissza
     */
    getNextPlayer(){
        return this._onTurn
    }


    /**
     * @return {boolean} A játék jelenlegi iránya
     *   (true: előre (1,2,3,1,2,3,...), false: hátra (3,2,1,3,2,1,...))
     */
    getDirection(){
        return this._originalDirection
    }


    /**
     * Adott játékos kártyalapjait visszaadja tömbben
     * @param {number} playerId - A játékos sorszáma
     * @return {Card[]}
     */
    getPlayerCards(playerId){
        return this._players[playerId]
    }


    /**
     * @return {boolean} Vége van-e a játéknak?
     */
    hasEnded(){
        let i = 0
        while(i < this._numOfPlayers){
            if (this._players[i] === undefined || this._players[i].length == 0){
                return true
            }
            i++
        }
        return false
    }



    /**
     * A kijátzott lapok megkeverésével új deck készítése húzáshoz.
     * A felső lapot kiveszi a kijátszott lapok közül, mivel az nem kell, hogy a keverésben részt vegyen
     * @private
     */
    _shuffleDeck(){
        this._playedCards.pop()
        this._deck.shuffle(this._playedCards)
        this._playedCards = []
        this._playedCards.push(this._topCard)
    }


/**
 * Segédfüggvény, amely a paraméterül kapott számmal lépteti a soron következő játékost tároló változót
 * @param {number} n - A szám, hogy mennyivel léptesse. Ennek értéke 1 (normál lépés) vagy 2 (skip esetén) lehet
 * @param {number} from - Kitől kezdve léptesse (közbedobás esetén ez nem a this._onTurn)
 * @private
 */
    _stepToNext(n, from){
        if (from !== undefined) this._onTurn = from
        let c = 0        
        if (this._originalDirection){
           while(c < n){                
               this._onTurn = (this._onTurn + 1)  % this._numOfPlayers
                if(this._removedPlayers[this._onTurn] == false){
                    c++
                } 

            } 
        } else 
            while(c < n){
               this._onTurn = (this._onTurn - 1 + this._numOfPlayers) % this._numOfPlayers
                if(this._removedPlayers[this._onTurn] == false){
                    c++
                } 
            }
    }


    /**
     * kiveszi a játékost a játékmenetből (tehát mindig átugorjuk őt; a játékosok sorszámai ne változzanak meg!)
     * @param {number} playerId - A kilépő játékos sorszáma
     */
    removePlayer(playerId){
       this._removedPlayers[playerId] = true
    }



    /**
     * console-ra írja az összes játékos lapját
     */
    toString(){
        for (let i = 0; i < this._numOfPlayers; i++){
            console.log(i + '. játékos:')
            for (let j = 0; j < this._players[i].length; j++){
                let card = this._players[i][j]
                console.log(j + '. lap: ' + card.color + ' ' + card.number + ' ' + card.type)
            }
            console.log('-------------------')
        }
    }

}

module.exports = SoloGame

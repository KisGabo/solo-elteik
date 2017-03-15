var CardDeck = require('./CardDeck.js');

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
     * @param {number} numOfPlayers - A játékosok száma, a [2, 10] intervallumba kell esnie.
     */
    constructor(deck, nOP){
        this._numOfPlayers = nOP
        this._deck = deck
        this._originalDirection = true
        this._onTurn = 0
        this._playedCards = []
        this._players = []//new Array(this._numOfPlayers).fill( new Array() )        
        this._wantedColor = ''
        this._cardsToDraw = 0
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
        
        this._topCard = this._deck.draw()
        this._playedCards.push(this._topCard)
        
    }


    /**
     * Igazat ad vissza, ha a card által jelölt lapot a playerId által jelölt sorszámú játékos szabályosan kijátszhatja, 
     * beleértve a közbedobást is. Különben hamisat.
     *
     * 
     * @param {card} card - A lap, amit valaki le szeretni tenni
     * @param {int} playerId - Annak a játékosnak a sorszáma, aki tenni szeretné  (0 .. numOfPlayers-1)
     * 
     * A card-nak így kell kinéznie:
     *  {
     *   color: '...',   // red, green, blue, yellow, ''
     *   type: '...',    // number, draw2, ...
     *   number: ...     // 1-9, ha számozott a lap
     *   }
     */
    canBePlaced(card, playerId){   
         // leellenőrzi, hogy az adott játékosnak van-e egyáltalán ilyen kártyája - console-beli hack-ek elkerülése miatt
        var b = false
        for (let i = 0; i < this._players[playerId].length; i++){
            if (this._players[playerId][i].color == card.color){
                if (this._players[playerId][i].type == card.type){
                    if (this._players[playerId][i].number == card.number){
                        b = true
                    }
                }
            }
        }
        if (!b){
            return false
        }

        // közbedobás ellenőrzése. Bármelyik játékos - akár a legutoljára dobó is-, aki birtokolja az utoljára dobott
        // lapot, soron kívül bedobhatja.
        for (let i = 0; i < this._players[playerId].length; i++){
            if (this._players[playerId][i].type == 'number' && card.type == 'number'){
                if (this._players[playerId][i].color == card.color){
                    if (this._players[playerId][i].number == card.number){
                        return true
                    }
                }
            } 
        }        

        // ha nem közbedobásról van szó és nem is a soron következő játékos dobna, akkor return false
        if (this._onTurn != playerId){
            return false
        }       

       
        // ha a legutoljára dobott lap típusa draw2 (húzz kettőt), a dobni kívánt lap pedig nem draw2
        if (this._topCard.type == 'draw2' && card.type != 'draw2'){
            return false
        }
        

        // szín- vagy számegyezés
           if (this._wantedColor == ''){
                 if (card.color == this._topCard.color || card.number == this._topCard.number){         
                     return true
                }
           } else 
                if (card.color ==_wantedColor){
                    return true
                }
       

        // nem draw4wild-ea wild vagy circular 
        if ( this._topCard.type != 'draw4wild' && (dcard.type == 'wild' || card.type == 'circular')){
            return true
        }

         // dra4wild
        if (card.type == 'draw4wild' ){
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
     * @param {int} cardId - A dobó játékos cardId sorszámú lapja 
     * @param {playerId} cardId - A dobó játékos sorszáma
     * @param {string} info -egy szín, ha színváltós kártyalapot tesz le, 
     *                      illetve egy játékos sorszáma kártyacsere lap esetén; -1 ha nem akar cserélni
     *                      'sima' (type == 'number') esetén üres string
     */
    place(cardId, playerId, info){
        const card = this._players[playerId][cardId]

        switch (card.type){
            case 'number': 
                this._wantedColor = ''
                this._cardsToDraw = 0
                 this._stepToNext(1)
                break
            case 'reverse':                
                this._originalDirection = !_originalDirection
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
                    this._players[i] = this._players[_onTurn]
                    this._players[_onTurn] = temp
                }
                this._wantedColor = ''
                this._cardsToDraw = 0
                this._stepToNext(1)
                break
            case 'circular':                
                if(_originalDirection){
                    let temp = this._players[_numOfPlayers-1]
                    for (let i = this._numOfPlayers-1; i > 0 ; i-- ){
                        this._players[i] = this._players[i-1]
                    }
                    this._players[0] = temp
                } else {
                    let temp = this._players[0]
                    for (let i = 0; i < this._numOfPlayers-1; i++ ){
                        this._players[i] = this._players[i-1]
                    }
                    this._players[_numOfPlayers-1] = temp
                }
                this._cardsToDraw = 0
                this._stepToNext(1)
                break
            case 'dra4wild':
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

        this._topCard = this._players[playerId].splice(cardId, 1)
        this._playedCards.push(this._topCard)

    }


    /**
     * A soron következő játékos nem tud vagy nem akar tenni, ezért húz a pakliból egyet 
     * (vagy kettőt, négyet, nyolcat, attól függően, hogy volt-e lerakva az előbbiekben húzós kártya); 
     * visszaadja a felhúzott lapok tömbjét (akkor is tömb, ha csak egy).
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
        this._cardsToDraw = 0
        this._stepToNext(1)
        return toDraw
    }


    /**
     * A legutóbbi lerakott kártyalapot adja vissza
     */
    getCurrentCard(){
        return this._topCard
    }


    /**
     * A soron következő játékos sorszámát adja vissza
     */
    getNextPlayer(){
        return this._onTurn
    }


    /**
     * A játék jelenlegi iránya (true: előre (1,2,3,1,2,3,...), false: hátra (3,2,1,3,2,1,...))
     */
    getDirection(){
        return this._originalDirection
    }


    /**
     *  Adott játékos kártyalapjait visszaadja tömbben
     * @param {int} playerId - A játékos sorszáma
     */
    getPlayerCards(playerId){
        return this._players[playerId]
    }


    /**
     * Vége van-e a játéknak?
     */
    hasEnded(){
        let i = 0
        while(i < this._numOfPlayers-1){
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
     * TODO: mi történjen olyankor, amikor elfogyott a deck (húzólap), de a soron következő nem dob, vagy mert nem tud, vagy mert nem akar?
     */
    _shuffleDeck(){
        this._playedCards.pop()
        this._deck.shuffle(_playedCards)
        this._playedCards = []
        this._playedCards.push(this._topCard)
    }


/**
 * Segédfüggvény, amely a paraméterül kapott számmal lépteti a soron következő játékost tároló változót
 * @param {int} n - A szám, hogy mennyivel léptesse. Ennek értéke 1 (normál lépés) vagy 2 (skip esetén) lehet
 */
    _stepToNext(n){
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
     * @param {int} playerId - A kilépő játékos sorszáma
     */
    removePlayer(playerId){
       this._removedPlayers[playerId] = true
    }



    // console-ra írja az összes játékos lapját
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

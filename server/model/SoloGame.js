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
    constructor(numOfPlayers){
        this._numOfPlayers = numOfPlayers
        this._deck = new CardDeck()
        this._originalDirection = true
        this._onTurn = 0
        this._playedCards = []
        this._players = [][]
        this._wantedColor = ''
        this._cardsToDraw = 0
        this._removedPlayers = new Array(_numOfPlayers).fill(false)

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < numOfPlayers; j++){
                _players[j].push(_deck.draw())
            }
        }

        _topCard = _deck.draw()
        _playedCards.push(_topCard)
        
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
        for (let i = 0; i < _players[playerId].length; i++){
            if (_players[playerId][i].color == card.color){
                if (_players[playerId][i].type == card.type){
                    if (_players[playerId][i].number == card.number){
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
        for (let i = 0; i < _players[playerId].length; i++){
            if (_players[playerId][i].type == 'number' && card.type == 'number'){
                if (_players[playerId][i].color == card.color){
                    if (_players[playerId][i].number == card.number){
                        return true
                    }
                }
            } 
        }        

        // ha nem közbedobásról van szó és nem is a soron következő játékos dobna, akkor return false
        if (_onTurn != playerId){
            return false
        }       

       
        // ha a legutoljára dobott lap típusa draw2 (húzz kettőt), a dobni kívánt lap pedig nem draw2
        if (_topCard.type == 'draw2' && card.type != 'draw2'){
            return false
        }
        

        // szín- vagy számegyezés
           if (_wantedColor == ''){
                 if (card.color == _topCard.color || card.number == _topCard.number){         
                     return true
                }
           } else 
                if (card.color ==_wantedColor){
                    return true
                }
       

        // nem draw4wild-ea wild vagy circular 
        if ( _topCard.type != 'draw4wild' && (dcard.type == 'wild' || card.type == 'circular')){
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
        const card = _players[playerId][cardId]

        switch (card.type){
            case 'number': 
                _wantedColor = ''
                _cardsToDraw = 0
                 _stepToNext(1)
                break
            case 'reverse':                
                _originalDirection = !_originalDirection
                _wantedColor = ''
                _cardsToDraw = 0
                _stepToNext(1)
                 break
            case 'skip':
                _wantedColor = ''
                _cardsToDraw = 0
                _stepToNext(2)
                break
            case 'draw2':
                _cardsToDraw += 2
                _stepToNext(1)
                break
            case 'swap':
                let i = parseInt(info)
                if (info != -1){
                    let temp = _players[i]
                    _players[i] = _players[_onTurn]
                    _players[_onTurn] = temp
                }
                _wantedColor = ''
                _cardsToDraw = 0
                _stepToNext(1)
                break
            case 'circular':                
                if(_originalDirection){
                    let temp = _players[_numOfPlayers-1]
                    for (let i = _numOfPlayers-1; i > 0 ; i-- ){
                        _players[i] = _players[i-1]
                    }
                    _players[0] = temp
                } else {
                    let temp = _players[0]
                    for (let i = 0; i < _numOfPlayers-1; i++ ){
                        _players[i] = _players[i-1]
                    }
                    _players[_numOfPlayers-1] = temp
                }
                _cardsToDraw = 0
                _stepToNext(1)
                break
            case 'dra4wild':
                _cardsToDraw += 4
                _wantedColor = info
                _stepToNext(1)
                break            
            case 'wild':
                _cardsToDraw = 0
                _wantedColor = info
                _stepToNext(1)
                break     

        }

        _topCard = _players[playerId].splice(cardId, 1)
        _playedCards.push(_topCard)

    }


    /**
     * A soron következő játékos nem tud vagy nem akar tenni, ezért húz a pakliból egyet 
     * (vagy kettőt, négyet, nyolcat, attól függően, hogy volt-e lerakva az előbbiekben húzós kártya); 
     * visszaadja a felhúzott lapok tömbjét (akkor is tömb, ha csak egy).
     */
    draw(){
        let toDraw = []
        if (_cardsToDraw == 0){
            toDraw.push(_deck.draw())
            if (_deck.count() == 0){
                _shuffleDeck()
            }
        } else {
            for (let i = i; i < _cardsToDraw; i++){
                toDraw.push(_deck.draw())
                if (_deck.count() == 0){
                _shuffleDeck()
            }
            }
        }
        return toDraw
    }


    /**
     * A legutóbbi lerakott kártyalapot adja vissza
     */
    getCurrentCard(){
        return _topCard
    }


    /**
     * A soron következő játékos sorszámát adja vissza
     */
    getNextPlayer(){
        return _onTurn
    }


    /**
     * A játék jelenlegi iránya (true: előre (1,2,3,1,2,3,...), false: hátra (3,2,1,3,2,1,...))
     */
    getDirection(){
        return _originalDirection
    }


    /**
     *  Adott játékos kártyalapjait visszaadja tömbben
     * @param {int} playerId - A játékos sorszáma
     */
    getPlayerCards(playerId){
        return _playedCards[playerId]
    }


    /**
     * Vége van-e a játéknak?
     */
    hasEnded(){
        let i = 0
        while(i < numOfPlayers-1){
            if (_playedCards[i]  == ÜRES){
                return true
            }
            i++
        }
        return false
    }



    // TODO: húzásnál a _cardsToDraw-ot nullázni!
    // TODO: hány lap (8??), amit maximum fel lehet húzni +2 vagy +4 esetén




    /**
     * A kijátzott lapok megkeverésével új deck készítése húzáshoz.
     * A felső lapot kiveszi a kijátszott lapok közül, mivel az nem kell, hogy a keverésben részt vegyen
     * TODO: mi történjen olyankor, amikor elfogyott a deck (húzólap), de a soron következő nem dob, vagy mert nem tud, vagy mert nem akar?
     */
    _shuffleDeck(){
        _playedCards.pop()
        _deck.shuffle(_playedCards)
        _playedCards = []
        _playedCards.push(_topCard)
    }


/**
 * Segédfüggvény, amely a paraméterül kapott számmal lépteti a soron következő játékost tároló változót
 * @param {int} n - A szám, hogy mennyivel léptesse. Ennek értéke 1 (normál lépés) vagy 2 (skip esetén) lehet
 */
    _stepToNext(n){
        let c = 0        

        if (_originalDirection){
            while(c < n){
                _onTurn = (_onTurn + 1) % numOfPlayers
                if(_removedPlayers[_onTurn] == false){
                    c++
                } 

            }
        } else 
            while(c < n){
                _onTurn = (_onTurn - 1 + numOfPlayers) % numOfPlayers
                if(_removedPlayers[_onTurn] == false){
                    c++
                } 
            }
    }


    /**
     * kiveszi a játékost a játékmenetből (tehát mindig átugorjuk őt; a játékosok sorszámai ne változzanak meg!)
     * @param {int} playerId - A kilépő játékos sorszáma
     */
    removePlayer(playerId){
        _removedPlayers[playerId] = true
    }



    // console-ra írja az összes játékos lapját
    toString(){
        for (let i = 0; i < numOfPlayers; i++){
            console.log(i + '. játékos:')
            for (let j = 0; j < _playedCards[i].length; j++){
                let card = _playedCards[i][j]
                console.log(j + '. lap: ' + card.color + ' ' + card.number + ' ' + card.type)
            }
        }
    }

}

module.exports = SoloGame

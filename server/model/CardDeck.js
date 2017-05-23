/**
 * A megkevert, lefelé fordított kártyapaklit reprezentálja.
 * @module Server/Model
 * @author Biró Ádám
 */
class CardDeck {

    /**
     * Konstruktork - feltölti a _cards tömböt az összes lappal, majd megkeveri
     */
    constructor(){
        // a _cards tömb feltöltése a lapokkal
        
        this._cards = []
        
        //számos lapok 1-től 9-ig
        for (let i = 1; i<=9; i++){
            // piros számok
            this._cards.push({
                        color: 'red',
                        type: 'number',
                        number: i
                        })

            this._cards.push({
                        color: 'red',
                        type: 'number',
                        number: i
                        })

            // zöld számok
            this._cards.push({
                        color: 'green',
                        type: 'number',
                        number: i
                        })

            this._cards.push({
                        color: 'green',
                        type: 'number',
                        number: i
                        })

            // kék számok
            this._cards.push({
                        color: 'blue',
                        type: 'number',
                        number: i
                        })

            this._cards.push({
                        color: 'blue',
                        type: 'number',
                        number: i
                        })  

            // sárga számok
            this._cards.push({
                        color: 'yellow',
                        type: 'number',
                        number: i
                        })


            this._cards.push({
                        color: 'yellow',
                        type: 'number',
                        number: i
                        })                                              
            
        }


         //lapok, amikből 4 van
        for (let i = 0; i < 4; i++){
            // körkörös kártyacsere
            this._cards.push({
                        color: '',
                        type: 'circular',
                        number: null
                        })  

             // húzz négyet és színválasztás
            this._cards.push({
                        color: '',
                        type: 'draw4wild',
                        number: null
                        })   

             // színválasztó
            this._cards.push({
                        color: '',
                        type: 'wild',
                        number: null
                        })                                                  
        }


        // lapok, amikből 2 van
        for (let i = 0; i < 2; i++){

            // irányváltoztatás
            this._cards.push({
                        color: 'red',
                        type: 'reverse',
                        number: null
                        })

            this._cards.push({
                        color: 'green',
                        type: 'reverse',
                        number: null
                        })   

            this._cards.push({
                        color: 'blue',
                        type: 'reverse',
                        number: null
                        })  

            this._cards.push({
                        color: 'yellow',
                        type: 'reverse',
                        number: null
                        })

            // húzz kettőt
            this._cards.push({
                        color: 'red',
                        type: 'draw2',
                        number: null
                        })

            this._cards.push({
                        color: 'green',
                        type: 'draw2',
                        number: null
                        })   

            this._cards.push({
                        color: 'blue',
                        type: 'draw2',
                        number: null
                        })  

            this._cards.push({
                        color: 'yellow',
                        type: 'draw2',
                        number: null
                        })

            // kimaradsz
            this._cards.push({
                        color: 'red',
                        type: 'skip',
                        number: null
                        })

            this._cards.push({
                        color: 'green',
                        type: 'skip',
                        number: null
                        })   

            this._cards.push({
                        color: 'blue',
                        type: 'skip',
                        number: null
                        })  

            this._cards.push({
                        color: 'yellow',
                        type: 'skip',
                        number: null
                        })                                                                                                                      
        }


        // amiből 1 van: kártyacsere
        this._cards.push({
                        color: 'red',
                        type: 'swap',
                        number: null
                        })

        this._cards.push({
                    color: 'green',
                    type: 'swap',
                    number: null
                    })   

        this._cards.push({
                    color: 'blue',
                    type: 'swap',
                    number: null
                    })  

        this._cards.push({
                    color: 'yellow',
                    type: 'swap',
                    number: null
                    })

        //végül keverés
        shuffleArray(this._cards)                                                              
    } // konstruktor vége


    /**
     *  hány kártyalap van még a pakliban
     * @return {number}
     */
    count(){
        return this._cards.length
    }


    /**
     * pakli tetejéről a következő kártyalapot adja vissza (és le is veszi a pakliról)
     * @return {Card}
     */
    draw(){
        return this._cards.pop()
    }


    /**
     * A paraméterül kapott tömb elemeit (az eddig kijátszott lapokat) megkeveri, majd ezt értékül adja a _cards tömbnek
     * Annak a műveletnek felel meg, amikor játék közben elfogy a deck és valaki megkeveri.
     *  @param {Card[]} t - A tömb, amely a kijátszott lapokat tartalmazza
     */
    shuffle(t){
        _cards = shuffle(t)
    }
    
}



/**
 * Megkeveri a paraméterül kapott tömb elemeit
 * @param {any[]} a - A tömb, amely a megkeverendő elemeket tartalmazza
 * @private
 */
 function shuffleArray(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

module.exports = CardDeck



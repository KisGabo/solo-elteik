/**
 * @file CardDeck osztály tesztjei
 * @author Biró Ádám
 */

// ezek a tesztelő környezethez kellenek
const chai = require('chai')
const assert = chai.assert
const AssertionError = chai.AssertionError

// importáld, ami kell
const CardDeck = require('../../server/model/CardDeck')

// ezt a változót ebben a fájban minden teszteset látja
let deck = new CardDeck()




describe('Konstruktor tesztelése', function () {    

  it('Egy új paklinak (példányosítás után) 112 lapot kell tartalmaznia', function () {

    let kapottEredmeny = deck._cards.length
    let elvartEredmeny = 112

    assert.equal(kapottEredmeny, elvartEredmeny)
  })

})

describe('draw() tesztelése', function () {    

  it('A húzásnak  tömb utolsó elemét kell visszaadnia (a pakli tetején lévő lapot)', function () {

    let elvartEredmeny = deck._cards[deck._cards.length-1]
    let kapottEredmeny = deck.draw()

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('Húzás után a pakli mérete eggyel csökken, 111-re', function () {

    let kapottEredmeny = deck.count()
    let elvartEredmeny = 111

    assert.equal(kapottEredmeny, elvartEredmeny)
  })
  
  it('A húzásnak  tömb utolsó elemét kell visszaadnia (a pakli tetején lévő lapot), mindig!', function () {

    let elvartEredmeny = deck._cards[deck._cards.length-1]
    let kapottEredmeny = deck.draw()

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('További 110 húzás után a deck mérete 0 kell, hogy legyen', function () {

    for (let i = 0; i < 120; i++){
        deck.draw()
    }

    let kapottEredmeny = deck.count()
    let elvartEredmeny = 0

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('A húzásnak az üres deck-re undefined-ot kell visszaadnia:', function () {

    
    let kapottEredmeny = deck.draw()

    //assert.equal(kapottEredmeny, elvartEredmeny)
    assert.isUndefined(kapottEredmeny)
  })

})



describe('shuffle() tesztelése', function () {   
    let deck2 = new CardDeck() 
    

    it('A deck2-nek (új deck) 112 lapot kell tartalmaznia', function () {
    
    let kapottEredmeny = deck2.count()
    let elvartEredmeny = 112

    assert.equal(kapottEredmeny, elvartEredmeny)
  })

  it('Ha a shuffle() paraméterül egy új deck-et kap (teljes pakli), újra 112 lapot kell tartalmaznia', function () {
    deck.shuffle(deck2._cards)
    let kapottEredmeny = deck.count()
    let elvartEredmeny = 112

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  


  it('A deck2-nek még mindig 112 lapot kell tartalmaznia', function () {
    
    let kapottEredmeny = deck2.count()
    let elvartEredmeny = 112

    assert.equal(kapottEredmeny, elvartEredmeny)

  })


  it('A deck-nek keverés után - 1:12544 - más lapot kell visszaadnia húzásra, mint a deck2', function () {
    
    let kapottEredmeny = deck.draw()
    let elvartEredmeny = deck2.draw()

    assert(kapottEredmeny !== elvartEredmeny)

  }) 


let cardArray = []
    cardArray.push(['red', 'number', 5])
    cardArray.push(['red', 'number', 4])
    cardArray.push(['red', 'number', 3])

  it('Ha a shuffle() paraméterül kap lapok egy 3-elemű tömbjét, 3 elemet kell tartalmaznia', function () {
    deck.shuffle(cardArray)
    let kapottEredmeny = deck.count()
    let elvartEredmeny = 3

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('Ha a shuffle() paraméterül üres tömböt kap, 0 elemet kell tartalmaznia', function () {
    let emptyArray = []
    deck.shuffle(emptyArray)

    assert.equal(deck.count(), 0)
  })

})



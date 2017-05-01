// npm run test-model

// ezek a tesztelő környezethez kellenek
const chai = require('chai')
const assert = chai.assert
const AssertionError = chai.AssertionError

// importáld, ami kell
const CardDeck = require('../../server/model/CardDeck')
const SoloGame = require('../../server/model/SoloGame')

// ezt a változót ebben a fájban minden teszteset látja
let deck = new CardDeck()
let game

describe('Konstruktor tesztelése', function () { 
    

 it('A _deck-nek (112 - _numOfPlayers * 8 - _playedCards.length) -eleműnek kell lennie - 2 és 10 közötti játékosszámmal tesztelve', function () {   

   for(let i = 2; i <= 10; i++){
     game = new SoloGame(new CardDeck(), i)
     //console.log('<<<<<<<<<<<<<<<<<<  ' + i + " játékossal >>>>>>>>>>>>>>>>>>") 
     //game.toString()  
     assert.equal(game._deck.count(), (112 - game._numOfPlayers * 8 - game._playedCards.length))
   }     
  })


  it('Először a következő játékos sorszámaa 0 kell, hogy legyen', function () {    

    let kapottEredmeny = game.getNextPlayer()
    let elvartEredmeny = 0

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('Először az irány előre (true) kell, hogy legyen', function () {    

    let kapottEredmeny = game.getDirection()
    let elvartEredmeny = true

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('Először a hasEnded() false kell, hogy legyen', function () {    

    let kapottEredmeny = game.hasEnded()
    let elvartEredmeny = false

    assert.equal(kapottEredmeny, elvartEredmeny)
  })


  it('A _playedCards[] tömb legalább 1 elemet kell, hogy tartalmazzon', function () {    

    assert.isAtLeast(game._playedCards.length, 1  )
  })


  it('A _playedCards[] tömb az utolsó elemén kívük nem tartalmazhat \'number\' típusú lapot', function () {    

    for (let i = 0; i < game._playedCards.length -1; i++ ){
          assert.notEqual(game._playedCards[i].type, 'number')
      }
  })


  it('A _plyers tömbnek _numOfPlayers-eleműnek kell lennie', function () {   

    assert.equal(game._players.length, game._numOfPlayers)
  })


  it('Minden játékosnál 8 lapnak kell lennie', function () {   

    for (let i = 0; i < game._numOfPlayers; i++ ){
          assert.equal(game._players[i].length, 8)
      }
  })


  it('A _wantedColor változónak üres stringnek kell lennie', function () {   

    assert.equal(game._wantedColor, '')
  })


  it('A _cardsToDraw változónak 0-nak kell lennie', function () {   

    assert.equal(game._cardsToDraw, 0)
  })


  it('A _removedPlayers tömbnek _numOfPlayers-eleműnek kell lennie', function () {   

    assert.equal(game._removedPlayers.length, game._numOfPlayers)
  })


  it('A _removedPlayers tömbnek csupa minden eleme false kell, hogy legyen', function () {   
      for (let i = 0; i <game._removedPlayers.length; i++ ){
          assert.equal(game._removedPlayers[i], false)
      }
    
  })


  it('A _topCard objektum típusa \'number\' kell, hogy legyen', function () {   

    assert.equal(game._topCard.type, 'number')
  })

})





describe('draw() tesztelése', function () { 
  let game2 = new SoloGame(new CardDeck(), 10)
  let top = game2.getCurrentCard()    

  it('A legfelső lapot (a tömb utolsó elemét) kell, hogy visszaadja', function () {    

    let elvartEredmeny = game2._deck._cards[game2._deck._cards.length - 1]
    let kapottEredmeny = game2.draw()

    assert.equal(kapottEredmeny[0], elvartEredmeny)
  })


  it('Mivel kezdetben a _topCard típusa nem \'number\', a húzott lapok tömbjének egyeleműnek kell lennie', function () {    

    let kapottEredmeny = game2.draw()    
    assert.equal(kapottEredmeny.length, 1)      
  })



it('Az összes lap felhúzása utáni  a _deck-nek 0-eleműnek kell lennie', function () {    
        
    while(game2._deck.count() > 0){
      game2.draw()
    }      
    //game2.toString()      
    //console.log('A _playedCards mérete: ' + game2._playedCards.size)
    assert.equal(game2._deck.count(), 0)     
  })


top = game2.getCurrentCard()


  it('Ha elfogyott a pakli a húzások miatt, a keverés után is (_playedCards.length - 1)-eleműnek kell lennie - mivel nincs mit letenni, lapot még egyik játékos se tet le', function () {    
        // TODO - utána nézni!
    game2.draw()  
    assert.equal(game2._deck.count(), game2._playedCards.length -1)     
  })


  it('Keverés után a _topCard-nak ugyanannak kell lennie, mint keverés előtt', function () {    
    assert.equal(game2.getCurrentCard(), top)     
  })


  it('A teljes pakli felhúzása miatt minden játékosnál Math.floor((most 10) legalább 8 + (112 - _numOfPlayers * 8 - _playedCards.length)/_numOfPlayers) db lapnak (most valszeg 3) kell lennie', function () {    
    //game2.toString()
    for(let i = 0; i < game2._numOfPlayers; i++){
      
        assert.isAtLeast(game2._players[i].length, Math.floor(((112 - game2._numOfPlayers * 8 - game2._playedCards.length) / game2._numOfPlayers) + 8) )    
    }
    
  })


  it('Ha DRAW2 után kettőt kell húzni', function () {
    let game22 = new SoloGame(new CardDeck(), 6)  
    let draw2 = {
                  color: 'red',
                  type: 'draw2',
                  number: null
                  }

      let i = game22._onTurn
      let n =  game22._players[1].length   
      game22._players[i].push(draw2)
      game22.place(game22._players[i].length - 1, i, '')
      game22.draw()

     assert.equal(game22._players[1].length, n+2)     
  })


  it('Két egymás utáni DRAW2 után négyet kell húzni', function () { 
    let game22 = new SoloGame(new CardDeck(), 6) 
    let draw2 = {
                  color: 'red',
                  type: 'draw2',
                  number: null
                  }

      let i = game22._onTurn
      let n =  game22._players[i+2].length   
      game22._players[i].push(draw2)
      game22._players[i+1].push(draw2)
      game22.place(game22._players[i].length - 1, i, '')
      game22.place(game22._players[i+1].length - 1, i+1, '')
      game22.draw()

     assert.equal(game22._players[i+2].length, n+4)     
  })


  it('Ha DRAW4WILD után négyet kell húzni', function () {
    let game22 = new SoloGame(new CardDeck(), 6)  
    let draw4wild = {
                  color: '',
                  type: 'draw4wild',
                  number: null
                  }

      let i = game22._onTurn
      let n =  game22._players[1].length   
      game22._players[i].push(draw4wild)
      game22.place(game22._players[i].length - 1, i, '')
      game22.draw()

     assert.equal(game22._players[1].length, n+4)     
  })


  it('Két egymás utáni DRAW4WILD után nyolcat kell húzni', function () { 
    let game22 = new SoloGame(new CardDeck(), 6) 
    let draw4wild = {
                  color: '',
                  type: 'draw4wild',
                  number: null
                  }

      let i = game22._onTurn
      let n =  game22._players[i+2].length   
      game22._players[i].push(draw4wild)
      game22._players[i+1].push(draw4wild)
      game22.place(game22._players[i].length - 1, i, '')
      game22.place(game22._players[i+1].length - 1, i+1, '')
      game22.draw()

     assert.equal(game22._players[i+2].length, n+8)     
  })

})


/**
     * Két játékossal indítom újra a játékot és az egyikkel felhúzatom az egész paklit - 
     * így nagyobb a legnagyobb a valószínűsége, hogy felhízlalt játékosnál lesz olyan lap, 
     * aminek a tesztelését végzem.
     * A játékot addig minden tesztesetnél addig indítom újra, amíg a fegfelső lap olyan nem lesz, 
     * amilyen a teszthet szükséges. Mivel ennek a típusa csak 'number' lehet, a többi esetet később
     * egy másik módszerrel tesztelem.
     * 
     */


let cardColors = ['red', 'green', 'blue', 'yellow']
describe('canBePlaced() tesztelése', function () { 

  // NUMBER-re

    for (let i = 0; i < 4; i++){
      describe(cardColors[i] + ' \'number\'-re..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          while(game3._topCard.color != cardColors[i] || game3._topCard.type != 'number')  {
              game3 = new SoloGame(new CardDeck(), 2)
          }          
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard
            


        for (let j = 0; j < 4; j++){
          if (i == j){ // színre színt

                it('..' + cardColors[i] + ' \'number\'-t - szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t - szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t - szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


          }// if vége
          else {  // színre más színt
                it('..' + cardColors[j] + ' számban nem egyező \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || 
                          game3._players[0][cardId].type != 'number' || game3._players[0][cardId].number == top.number) ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    //console.log(top)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'reverse \'-t - NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'swap \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

          }// else vége
        } // 2. for vége

      }) //belső describe vége
    }//1. for vége  






    // REVERSE-re
    for (let i = 0; i < 4; i++){
      describe(cardColors[i] + ' \'REVERSE\'-re..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: cardColors[i],
                        type: 'reverse',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard
            //console.log(cardColors[i] + ' színnél a TOP kártya:')
            //console.log(top)



        for (let j = 0; j < 4; j++){
          if (i == j){ // színre színt

                it('..' + cardColors[i] + ' \'number\'-t - szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t - szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t - szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


          }// if vége
          else {  // színre más színt
                it('..' + cardColors[j] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  /*let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                  */
                   let card = {
                        color: cardColors[j],
                        type: 'number',
                        number: 5
                                    }
                                    console.log(card)
                  game3._players[0].push(card)  
                  assert.isFalse(game3.canBePlaced(card, 0))
                })


                it('..' + cardColors[j] + ' \'reverse \'-t -  szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'swap \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

          }// else vége
        } // 2. for vége

      }) //belső describe vége
    }//1. for vége              

              



// SKIP-re
    for (let i = 0; i < 4; i++){
      describe(cardColors[i] + ' \'SKIP\'-re..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: cardColors[i],
                        type: 'skip',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard
            //console.log(cardColors[i] + ' színnél a TOP kártya:')
            //console.log(top)



        for (let j = 0; j < 4; j++){
          if (i == j){ // színre színt

                it('..' + cardColors[i] + ' \'number\'-t - szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t - szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t - szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


          }// if vége
          else {  // színre más színt
                it('..' + cardColors[j] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'reverse \'-t -  NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'swap \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

          }// else vége
        } // 2. for vége

      }) //belső describe vége
    }//1. for vége              




// SWAP-ra
    for (let i = 0; i < 4; i++){
      describe(cardColors[i] + ' \'SWAP\'-ra..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: cardColors[i],
                        type: 'swap',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard
            //console.log(cardColors[i] + ' színnél a TOP kártya:')
            //console.log(top)



        for (let j = 0; j < 4; j++){
          if (i == j){ // színre színt

                it('..' + cardColors[i] + ' \'number\'-t - szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t - szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t - szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


          }// if vége
          else {  // színre más színt
                it('..' + cardColors[j] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'reverse \'-t -  NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'swap \'-t - szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })

          }// else vége
        } // 2. for vége

      }) //belső describe vége
    }//1. for vége              

  



  // DRAW2-ra
    for (let i = 0; i < 4; i++){
      describe(cardColors[i] + ' \'DRAW2\'-ra..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: cardColors[i],
                        type: 'draw2',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard
            //console.log(cardColors[i] + ' színnél a TOP kártya:')
            //console.log(top)



        for (let j = 0; j < 4; j++){
          if (i == j){ // színre színt

                it('..' + cardColors[i] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t - NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'wild \'-t  NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \'-t NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


          }// if vége
          else {  // színre más színt
                it('..' + cardColors[j] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'reverse \'-t -  NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[j] + ' \'swap \'-t NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[j] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

          }// else vége
        } // 2. for vége

      }) //belső describe vége
    }//1. for vége              



//CIRCULAR-ra
    
      describe(' \'CIRCULAR\'-ra..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: '',
                        type: 'circular',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard


        for (let i = 0; i < 4; i++){          

                it('..' + cardColors[i] + ' \'number\'-t szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t  szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \' szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })

            } // for vége


                it('.. \'wild \'-t szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \' szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })
        
      }) //belső describe vége


//WILD-ra    
      describe(' \'WILD\'-ra..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: '',
                        type: 'wild',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard


        for (let i = 0; i < 4; i++){          

                it('..' + cardColors[i] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t -  NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

            } // for vége


                it('.. \'wild \'-t szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \' szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })
        
      }) //belső describe vége      



//DRA4WILD-ra    
      describe(' \'DRA4WILD\'-ra..', function () {
          let game3 = new SoloGame(new CardDeck(), 2)   
          
          game3._topCard = {
                        color: '',
                        type: 'draw4wild',
                        number: null
                        }        
          // a maradék pakli felhúzatása a 0. indexű játékossal:            
            game3._cardsToDraw = 112 - 16 - game3._playedCards.length -1
            game3.draw()            
            game3._stepToNext(1) // újra az 1. játékos jöjjön 
            let top =  game3._topCard


        for (let i = 0; i < 4; i++){          

                it('..' + cardColors[i] + ' \'number\'-t - NEM szabad', function () {   
                  // egy piros + number lap megtalálása:
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || 
                          game3._players[0][cardId].type != 'number') ){
                    cardId++
                  }
                  if(cardId < game3._players[0].length){                    
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'reverse \'-t -  NEM szabad', function () {               
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'reverse') ){
                    cardId++
                  }    
                  if(cardId < game3._players[0].length){       
                    let card =  game3._players[0][cardId]  
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'skip \'-t - NEM szabad', function () {             
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'skip')){
                    cardId++
                  }     

                  if(cardId < game3._players[0].length){      
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'draw2 \'-t - NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'draw2') ){
                    cardId++
                  }  

                  if(cardId < game3._players[0].length){         
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('..' + cardColors[i] + ' \'swap \'-t NEM szabad', function () {            
                  let cardId = 0
                  while(cardId < game3._players[0].length && (game3._players[0][cardId].color != cardColors[i] || game3._players[0][cardId].type != 'swap')){
                    cardId++
                  }          

                  if(cardId < game3._players[0].length){ 
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })

            } // for vége


                it('.. \'wild \'-t NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'wild'){
                    cardId++
                  }       

                  if(cardId < game3._players[0].length){    
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'draw4wild \'-t szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'draw4wild'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    //console.log(card)
                    assert.isTrue(game3.canBePlaced(card, 0))
                  }
                })


                it('.. \'circular \' NEM szabad', function () {            
                  let cardId = 0
                  while( cardId < game3._players[0].length && game3._players[0][cardId].type != 'circular'){
                    cardId++
                  }   

                  if(cardId < game3._players[0].length){        
                    let card =  game3._players[0][cardId]
                    assert.isFalse(game3.canBePlaced(card, 0))
                  }
                })
        
      }) //belső describe vége        
            
    it('Közbedobás: nem a soron következő játékos azonos szám típusú lapot tehet', function () {
          let game3 = new SoloGame(new CardDeck(), 5)   

          let card = {
                        color: 'red',
                        type: 'number',
                        number: 5
                        } 

          game3._topCard =  card
          game3._players[3].push(card)

          assert.isTrue(game3.canBePlaced(card, 3))
    })


    it('Közbedobás: nem megfelelő lapot nem szabad', function () {
          let game3 = new SoloGame(new CardDeck(), 5)   

          let card = {
                        color: 'red',
                        type: 'number',
                        number: 3
                        } 

          let card2 = {
                        color: 'red',
                        type: 'number',
                        number: 6
                        }   

          let card3 = {
          color: 'red',
          type: 'number',
          number: 8
          }                     

          game3._topCard =  card
          game3._players[4] = []
          game3._players[4].push(card3)

          assert.isFalse(game3.canBePlaced(card, 4))
    })


    it('Közbedobás: a közbedobónak nincs is ilyen lapja', function () {
          let game3 = new SoloGame(new CardDeck(), 5)   

          let card = {
                        color: 'red',
                        type: 'number',
                        number: 5
                        }                       

          game3._topCard =  card
          game3._players[3] = []

          assert.isFalse(game3.canBePlaced(card, 3))
    })


    it('Közbedobás: a közbedobónak van ilyen lapja', function () {
          let game3 = new SoloGame(new CardDeck(), 5)   

          let card = {
                        color: 'red',
                        type: 'number',
                        number: 5
                        }                       

          game3._topCard =  card
          game3._players[3].push(card)

          assert.isTrue(game3.canBePlaced(card, 3))
    })


    it('A soron következő játékosnak nincs is olyen lapja, amilyet tenni akar', function () {
          let game3 = new SoloGame(new CardDeck(), 5)   

          let card = {
                        color: 'red',
                        type: 'number',
                        number: 5
                        }                       

          game3._topCard =  card
          game3._players[game3._onTurn] = []

          assert.isFalse(game3.canBePlaced(card, game3._onTurn))
    })



})





describe('place() tesztelése', function () { 
    
  let game4 = new SoloGame(new CardDeck(), 5)
  let card = {
                        color: 'red',
                        type: 'number',
                        number: 5
                        }

                        

 it('A place() után csökkenie kell a játékosnál lévő lapok számának 1-el', function () {
      game4._players[0].push(card)                              
      game4.place(8, 0, '')

     assert.equal(game4._players[0].length, 8)      
  })

  it('A _topCard-nak a legutóbb kijátszott lapnak kell lennie', function () { 

      assert.equal(game4._topCard, card)
    }) 

    it('A soron következő játékost léptetnie kell eggyel', function () { 

      assert.equal(game4._onTurn, 1)
    })


    it('DRAW2 után a _cardsToDraw-nak be kell állítódnia', function () {
      let draw2 = {
                        color: 'red',
                        type: 'draw2',
                        number: null
                        }

      let i = game4._onTurn      
      game4._players[i].push(draw2)
      game4.place(game4._players[i].length - 1, i, '')

      assert.equal(game4._cardsToDraw, 2)
    })


    it('DRAW4WILD + info után a _wantedColor-nak és a _cardsToDraw-nak be kell állítódnia', function () {
      let game4 = new SoloGame(new CardDeck(), 5)
      let wildCard = {
                        color: '',
                        type: 'draw4wild',
                        number: null
                        }

      let i = game4._onTurn      
      game4._players[i].push(wildCard)
      game4.place(game4._players[i].length - 1, i, 'red')

      assert.equal(game4._wantedColor, 'red')
      assert.equal(game4._cardsToDraw, 4)
    })

    it('WILD + info után a _wantedColor-nak  be kell állítódnia', function () {
      let wildCard = {
                        color: '',
                        type: 'wild',
                        number: null
                        }

      let i = game4._onTurn      
      game4._players[i].push(wildCard)
      game4.place(game4._players[i].length - 1, i, 'blue')
      
      assert.equal(game4._wantedColor, 'blue')
    })


    it('REVERSE után az irány megfordul', function () {
      let reverse = {
                        color: 'red',
                        type: 'reverse',
                        number: null
                        }

      let i = game4._onTurn      
      game4._players[i].push(reverse)
      game4.place(game4._players[i].length - 1, i, '')
      
      assert.equal(game4._originalDirection, false)
    })


    it('SKIP után kihagy egy játékost', function () {
      let game4 = new SoloGame(new CardDeck(), 5)
      let skip = {
                        color: 'red',
                        type: 'skip',
                        number: null
                        }

      let i = game4._onTurn      
      game4._players[i].push(skip)
      game4.place(game4._players[i].length - 1, i, '')
      
      assert.equal(game4._onTurn, 2)
    })


    it('SWAP után a kártyáknak ki kell cserélődniük', function () {
      let game4 = new SoloGame(new CardDeck(), 5)
      let swap = {
                        color: 'red',
                        type: 'swap',
                        number: null
                        }

      let i = game4._onTurn
      let cardsOf0 =  game4._players[0]   
      let cardsOf3 =  game4._players[3]
      game4._players[i].push(swap)
      game4.place(game4._players[i].length - 1, i, '3')
      
      assert.equal(game4._players[0], cardsOf3)
      assert.equal(game4._players[3], cardsOf0)
    })

    it('SWAP után ha nem akar cserélni, a kártyáknak nem kell kicserélődniük', function () {
      let game4 = new SoloGame(new CardDeck(), 5)
      let swap = {
                        color: 'red',
                        type: 'swap',
                        number: null
                        }

      let i = game4._onTurn
      let cardsOf0 =  game4._players[0]  
      game4._players[i].push(swap)
      game4.place(game4._players[i].length - 1, i, '-1')
      
      assert.equal(game4._players[0], cardsOf0)
    })

    it('CIRCULAR után a kártyáknak ki  kell kicserélődniük', function () {
      let game4 = new SoloGame(new CardDeck(), 3)
      let circular = {
                        color: '',
                        type: 'circular',
                        number: null
                        }

      let i = game4._onTurn
      let cardsOf0 =  game4._players[0]
      let cardsOf1 =  game4._players[1]  
      let cardsOf2 =  game4._players[2]    
      game4._players[i].push(circular)
      game4.place(game4._players[i].length - 1, i, '')
      
      assert.equal(game4._players[0], cardsOf2)
      assert.equal(game4._players[1], cardsOf0)
      assert.equal(game4._players[2], cardsOf1)
    })
})


  describe('hasEnded() tesztelése', function () {    

        it('Új játék indítása után false', function () { 
            game = new SoloGame(new CardDeck(), 4)
            assert.isFalse(game.hasEnded())
        })

        it('Ha egy játékosnak elfogytak a lapjai, akkor true', function () { 
            game._players[0] = []
            assert.isTrue(game.hasEnded())
        })
  })


  describe('removePlayer() tesztelése', function () {    

        it('Egy játékos törlése után a törölt játékost a kör átugorja', function () { 
            let game55 = new SoloGame(new CardDeck(), 4)
            let numberCard = {
                        color: 'blue',
                        type: 'number',
                        number: 6
                        }
            game55._players[0].push(numberCard)                        
            game55.removePlayer(1)
            game55.place(8, 0, '')
            assert.equal(game55._onTurn, 2)
        })

        it('Egy játékos törlése után a törölt játékost a kör átugorja akkor is, ha épp a tömb végén van', function () { 
            let game55 = new SoloGame(new CardDeck(), 4)
            let numberCard = {
                        color: 'blue',
                        type: 'number',
                        number: 6
                        }
            game55._players[2].push(numberCard) 
            game55._onTurn = 2
            game55.removePlayer(3)
            game55.place(8, 2, '')
            assert.equal(game55._onTurn, 0)
        })

        
  })


   describe('getPlayerCards() tesztelése', function () { 
     let game55 = new SoloGame(new CardDeck(), 4)
            let numberCard = {
                        color: 'blue',
                        type: 'number',
                        number: 6
                        } 
      game55._players[2] = []
      game55._players[2].push(numberCard)  
      let arr = []
      arr.push(numberCard)
          
      assert.equal(game55.getPlayerCards(2)[0], arr[0])
      assert.equal(game55.getPlayerCards(2).length, arr.length)                       

})        
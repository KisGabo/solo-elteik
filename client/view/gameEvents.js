/**
 * @file Ezek a függvények reagálnak a játék történéseire.
 *   Frissítik a HTML-t, animálnak, stb, ami csak kell.
 * @module Client/GameEvents
 * @see /docs/szerver-iface.md "Szerver --> kliens" rész
 * @author Deák Dániel
 */

import { $, $$ } from './helper'
import * as remoteActions from '../remoteActions'


// globálisok
var canvas, ctx
var waitroom = true
var blueCards = loadImages('B')
var redCards = loadImages('R')
var greenCards = loadImages('G')
var yellowCards = loadImages('Y')
var blackCards = loadImages('N')
var backSide = loadImage('back')
var players= []
var player = {name:'',id:'',noCards:0,cards:[]}
var topCard
var lastClickedCard

/**
 * ha jön a jelzés a szervertől, hogy új ember csatlakozott,
 * beszúr egy új elemet a listába
 * @param {Object} data Szerver által küldött adat
 * @param {string} data.name Játékos neve
 * @param {number} data.id Játékos azonosítója
 */
export function playerConnected (data) {
    console.log('--> client: playerConnected', data)
    var newPlayer = document.createElement('li')
    newPlayer.setAttribute('class','playerInWaiting')
    newPlayer.setAttribute('id', 'player-'+data.id)
    newPlayer.innerHTML = 'Sorszám: ' + data.id + ' Név: ' + data.name
    players[data.id] = {'id':data.id,'name':data.name,'noCards':8}
    $('#players').appendChild(newPlayer)

}

/**
 * szerveroldali jelzésre kivesz valakit a listából Id alapján
 * @param {number} playerId Játékos azonosítója
 */
export function playerDisconnected (playerId) {
    if(waitingroom){
        $('#players').removeChild(document.getElementById("player-"+playerId))
    }else{
        deletePlayer(playerId)
    }
}

/**
 * Elindítja a játékot, megjeleníti a játékfelületet.
 * @param {Object} data Szerver által küldött adat
 * @param {Card[]} data.cards A játékosnak osztott lapok
 * @param {Card} dara.firstCard A kezdő lap
 */
export function started (data) {
    console.log('--> client: started', data);
    player.id=findPlayerByName(player.name)
    player.cards=data.cards
    player.noCards = data.cards.length
    console.log(player)
    waitroom = false
    topCard = data.firstCard
    gameInit(data.firstCard)

}

/**
 * Frissíti a felületet, mikor egy kártyalapot lerakott valaki.
 * @param {Object} data Szerver által küldött adat
 * @param {Card} data.card A lerakott lap
 * @param {number} data.playerId Ki rakta le
 * @param {string} [data.info] Ha színválasztó lap, akkor a választott szín
 * @param {Card[]} [data.newCards] Ha minket érintő csere történt, akkor az új lapjaink
 * @param {number[]} [data.numOfCards] Ha csere történt, akkor a játékosok lapjainak száma
 */
export function cardPlaced (data) {
    console.log('PLAYER IDS', data.playerId, player.id)
    if (data.end) {
        alert('A játéknak vége. ' + 
                (data.playerId === player.id ?
                'Te nyertél.' :
                players[data.playerId].name + ' nyert.'))
        window.location.reload()
        return
    }
    if (data.playerId == player.id) {
        removeCard(lastClickedCard)
    } else {
        players[data.playerId].noCards--
        if(data.card.type=="wild"||data.card.type=="draw4wild"){
            alert(data.info+" színt kért a játékos")
        }
    }
    if(data.newCards && data.newCards.length>0){
        player.cards=data.newCards
        player.noCards = data.newCards.length
    }
    if (data.numOfCards) {
        data.numOfCards.forEach((noCards, i) => players[i].noCards = noCards)
    }
    topCard = data.card
    redraw()
}

/**
 * Frissíti a felületet, amikor húzott valaki.
 * @param {Object} data Szerver által küldött adat
 * @param {number} data.numOfCards Hány lapot húztak fel egyszerre
 * @param {number} data.playerId Ki húzott
 * @param {Card[]} [data.drawnCards] Ha mi húztunk, akkor a húzott lapok
 */
export function drawn (data) {
    if (player.id == data.playerId){
        for (var c of data.drawnCards) {
            player.cards.push(c)
        }
        player.noCards+=data.numOfCards
    }
    players[data.playerId].noCards+=data.numOfCards
    redraw()
}

/**
 * Lefut, amikor nem jó lapot tettünk,
 * vagy nem jókor akartunk lapot tenni.
 */
export function illegalAction () {
    alert('Ezt most nem lépheted meg.')
}






/**
 * Beállítja a kliens játékos nevét.
 * @param {string} name
 */
export function setPlayer(name){
    player.name = name
}

/**
 * Megkeresi a játékos ID-ját név alapján.
 * @param {string} name A játékos neve
 * @return {number} A játékos ID-ja
 * @private
 */
function findPlayerByName(name){
    for (var p of players){
        if(p.name == name) return p.id
    }
}

/**
 * Image elemet tölt be.
 * @param {string} cardName A kártya neve
 * @return {Image} Image elem
 * @private
 */
function loadImage(cardName){
  var img = new Image();
  img.src = "images/cards/"+cardName+".jpg"
  return img

}

/**
 * Betölti az adott színű kártyalapok képeit.
 * @param {string} color Színjelzés
 * @return {Map<string, Image>} A betöltött képek
 * @private
 */
function loadImages(color){
    var cards = new Map()
    var numbers = ['1','2','3','4','5','6','7','8','9']
    if(color!='N'){
        for (var i=0; i<9;i++){
            cards.set(numbers[i],loadImage(color+(i+1)+''))
        }
        cards.set('draw2',loadImage(color+'-draw2'))
        cards.set('reverse',loadImage(color+'-reverse'))
        cards.set('skip',loadImage(color+'-skip'))
        cards.set('swap',loadImage(color+'-swap'))
        return cards
    }else{
        cards.set('circular', loadImage('N-circular'))
        cards.set('draw4wild',loadImage('N-draw4wild'))
        cards.set('wild',loadImage('N-wild'))
        return cards
    }
}

//segédfüggvények, hogy ne legyen minden egybe ömleszve

/**
 * Kirajzol egy kártyát.
 * @param {any} ctx Context
 * @param {Image} img Kirajzolandó kártya képe
 * @param {number} x X koordináta
 * @param {number} y Y koordináta
 * @private
 */
function drawCard(ctx, img, x,y){
  ctx.drawImage(img,x,y,img.width,img.height)
  ctx.strokeStyle="rgba(0,0,0,0.9)"

  ctx.strokeRect(x,y,img.width,img.height)
}

/**
 * @param {any[]} drawnCards
 * @param {number} numOfCards
 * @return {any|any[]} Kirajzolható kártyák
 * @private
 */
function cardsDrawn(drawnCards, numOfCards){
    var card = {}
    var cardColor
    var cardSuffix
    var cardImages=[]
    if(numOfCards == 1 && !drawnCards[0]){
        card = drawnCards
        cardColor = decideColor(card.color) //eldönti a rövidítését
        if(card.type=='number'){
            cardSuffix = card.number
        }else {
            cardSuffix = card.type
        }
        cardImages= cardColor.get(''+cardSuffix)
        
    }
    else{
        for (var i=0; i<numOfCards; i++){
            card = drawnCards[i]
            cardColor = decideColor(card.color) //eldönti a rövidítését
            if(card.type=='number'){
                cardSuffix = card.number
            }else {
                cardSuffix = card.type
            }
            cardImages[i]= cardColor.get(''+cardSuffix)
        }
    }
    return cardImages
}


/**
 * Adott szín kártyalapjait adja vissza.
 * @param {string} color Szín
 * @return {any[]}
 * @private
 */
function decideColor(color){
    switch (color){
        case 'red': return redCards
        case 'blue': return blueCards
        case 'green': return greenCards
        case 'yellow': return yellowCards
        default: return blackCards
    }
}

/**
 * Adott játékosnak kirajzol egy kártyát.
 * @param {Object} player Játékos
 * @param {number} player.noCards A játékos lapjainak száma
 * @param {number} j Az asztal melyik helyére rajzolja (0-2)
 * @param {number} i Hányadik kártyahelyre rajzolja
 * @private
 */
function drawCardFor(player,j,i){
    switch (j){
        case 0:  drawCard(ctx,backSide, (canvas.width-backSide.width-10), ((canvas.height/2)-(player.noCards)*15)+i*15)
        case 1:  drawCard(ctx,backSide,((canvas.width/2)-(player.noCards-1)*15)+i*15, 10)
        case 2:  drawCard(ctx,backSide, 10, ((canvas.height/2)-(player.noCards)*15)+i*15)
        default: break
    }
}

//játéktér

/**
 * Előállítja a játékteret.
 * @param {Card} firstCard A kezdő lap
 * @private
 */
function gameInit(firstCard){

    //temporary 
    /** Mivel a szerverrel való kapcsolat kliensfejlesztésnél smafu, muszáj magamtól betenni játékost */
    //players.push(player)
    //
   $("#waitArea").style.display="none"
   $("#welcomePage").style.display="none";
   $('#gameArea').style.display="block"

  canvas= document.createElement('canvas')


  canvas.setAttribute("id", "canvas")
  canvas.width = 1200
  canvas.height = 750
  $("#gameArea").appendChild(canvas)
  ctx = document.getElementById('canvas').getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.canvas.addEventListener('mousedown', clicked)   

  var cardImages = cardsDrawn(player.cards,player.noCards)
  var topCardImage = cardsDrawn(firstCard, 1)
  drawCard(ctx, topCardImage, (canvas.width/2)-(backSide.width/2)-25 , (canvas.height/2)-(backSide.height/2))
  var tracker = 0;
  for (var j=0;j<players.length;j++){
    for(var i=0; i<players[j].noCards;i++){
        console.log('draw card', players[j], i);
        if(players[j].id!=player.id){
             drawCardFor(players[j],tracker,i)
        }
        else{
            drawCard(ctx,cardImages[i],((canvas.width/2)-(player.noCards-1)*50)+i*85,(canvas.height-backSide.height-10))
        } 
    }
    if(players[j].id != player.id) tracker++
  }
  for (var i = 0; i<10; i++){
    drawCard(ctx,backSide, (canvas.width/2)+(backSide.width/2)-10 + i*2.5, (canvas.height/2)-(backSide.height/2) + i *2.5) //pakli
  }


}

/**
 * Újrarajzolja a képernyőt.
 * @private
 */
function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);//letörli az eddigit
    var noPlayers = 4
    var cardImages = cardsDrawn(player.cards,player.noCards)
    drawCard(ctx, cardsDrawn(topCard, 1), (canvas.width/2)-(backSide.width/2)-25 , (canvas.height/2)-(backSide.height/2))//középső lap
    var tracker = 0;//hogy tudjuk, melyik ellenfélnek rajzolandó ki a lapja

    //játékosok lapjai
    for (var j=0;j<noPlayers;j++){
        for(var i=0; i<players[j].noCards;i++){
            if(players[j].id!=player.id){
                drawCardFor(players[j],tracker,i)
            }
            else{
                drawCard(ctx,cardImages[i],((canvas.width/2)-(player.noCards-1)*50)+i*85,(canvas.height-backSide.height-10))
            } 
        }
        if(players[j].id != player.id) tracker++
    }
    //pakli
    for (var i = 0; i<10; i++){
        drawCard(ctx,backSide, (canvas.width/2)+(backSide.width/2)-10 + i*2.5, (canvas.height/2)-(backSide.height/2) + i *2.5) //pakli
    }

}

/**
 * Kiveszi a kirakott lapot a játékos kezéből.
 * @param {number} pos A lerakott kártya indexe
 * @private
 */
function removeCard(pos){
  player.cards.splice(pos,1)
//   var tempcards = []
//   for (var i=0; i<player.noCards;i++){
//       if(player.cards[i]) tempcards.push(player.cards[i])
//   }
//   player.cards = tempcards
  player.noCards-=1
  players[player.id].noCards-=1
}

/**
 * Kilépő játékos törlése.
 * @param {number} playerId A kilépett játékos azonosítója
 * @private
 */
function deletePlayer(playerId){
  players.splice(playerId,1)
  var temp = []
  for (var i=0; i<players.length;i++){
      if(players[i]) temp.push(players[i])
  }
  players = temp

}


//egérakciók

/**
 * Kezeli a canvason való kattintást.
 * Megnézi, hogy hova kattintott a játékos: kártyára vagy a paklira,
 * és aszerint cselekszik.
 * @param {any} ev Eseményobjektum
 * @private
 */
function clicked(ev){
    var rect = canvas.getBoundingClientRect();
    var mX = ev.pageX -rect.left -document.body.scrollLeft
    var mY = ev.pageY -rect.top -document.body.scrollTop
    console.log(mX + ':' +mY)
    var imgX
    var imgY
    var deckX =(canvas.width/2)+(backSide.width/2)-10
    var deckY =  (canvas.height/2)-(backSide.height/2) 
    if(mX>=deckX && mX<deckX+(9*2.5)+backSide.width && mY >= deckY && mY < deckY+(9*2.5)+backSide.height){
         console.log("pakli" )
         remoteActions.draw()
    }
    for(var i = 0; i<player.noCards; i++){
        imgX = ((canvas.width/2)-(player.noCards-1)*50+i*85)
        imgY = canvas.height-backSide.height-10
        console.log(imgY)
        if(mX>= imgX && mX< imgX+backSide.width && mY >= imgY && mY < imgY + backSide.height){
            console.log("Bent " + i )
            var info
            if(player.cards[i].type=="draw4wild" ||player.cards[i].type=="wild") info = wild()
            else if (player.cards[i].type=="swap") info = swap()
            remoteActions.place({ cardId: i, info: info })
            lastClickedCard = i
            console.log(player.cards[i])
        }
    }
}

/**
 * Megkérdezi a játékost a választott színről.
 * @return {string} A szín
 * @private
 */
function wild(){
 while (true) {
  var color=  prompt("Kérlek, adj meg egy színt, amelyet kiválasztanál!(red/blue/green/yellow)");
  if(color=='red'||color=='blue'||color=='green'||color=='yellow') return color
 }
}

/**
 * Megkérdezi a játékost, hogy kivel szeretne cserélni.
 * @return {number} A játékos sorszáma, vagy -1, ha nem cserél
 * @private
 */
function swap(){
 while (true) {
  var swapWith = prompt("Kérlek add meg a játékos sorszámát (0-tól kezdve), akivel cserélni szeretnél! (vagy -1 ha nem szeretnél cserélni)")
  swapWith = parseInt(swapWith)
  if (swapWith < players.length && swapWith >= -1 && player.id !== swapWith) return swapWith
 }
}

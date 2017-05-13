import { $, $$ } from './helper'
import * as remoteActions from '../remoteActions'
/**
 * Ezek hívódnak meg, ha valami történik a játékban.
 * Ezek frissítik a HTML-t, animálnak, stb, ami csak kell.
 * Bővebb infó: /docs/szerver-iface.md "Szerver --> kliens" rész
 */


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

/* ha jön a jelzés a szervertől, hogy új ember csatlakozott, beszúr egy új 
elemet a listába */
export function playerConnected (data) {
    var newPlayer = document.createElement('li')
    newPlayer.setAttribute('class','playerInWaiting')
    newPlayer.setAttribute('id', 'player-'+data.id)
    newPlayer.innerHTML = 'Sorszám: ' + data.id + ' Név: ' + data.name
    players.push({'id':data.id,'name':data.name,'noCards':0})
    console.log(player)
    $('#players').appendChild(newPlayer)

}

/* szerveroldali jelzésre kivesz valakit a listából Id alapján */
export function playerDisconnected (playerId) {
    if(waitingroom){
        $('#players').removeChild(document.getElementById("player-"+playerId))
    }else{
        deletePlayer(playerId)
    }
}

export function started (data) {
    player.id=findPlayerByName(player.name)
    player.cards=data.cards
    player.noCards = data.cards.length
    console.log(player)
    waitroom = false
    gameInit(data.firstCard)

}
`{ card: ..., playerId: ..., info: ..., newCards: [...] }`
export function cardPlaced (data) {
    players[data.playerId].noCards--
    if(data.card.type=="wild"||data.card.type=="draw4wild"){
        alert(data.info+" színt kell raknod!")
    }else if(newCards.length>0){
        player.cards=newCards
    }
    redraw()
}

//data = { numOfCards: ..., playerId: ..., drawnCards: [...] }
export function drawn (data) {
    if (player.id = data.playerId){
        player.cards.push(data.drawnCards)
        player.noCards+=numOfCards
    }else{
        players[data.playerId].noCards+=numOfCards
    }
    redraw()
}

export function illegalAction () {

}






//játékoskezelés
export function setPlayer(name){
    player.name = name
}

function findPlayerByName(name){
    for (p in players){
        if(p.name == name) return p.id
    }
}

//képkezelés

function loadImage(cardName){
  var img = new Image();
  img.src = "images/cards/"+cardName+".jpg"
  return img

}
//betölti a képeket
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
function drawCard(ctx, img, x,y){
  ctx.drawImage(img,x,y,img.width,img.height)
  ctx.strokeStyle="rgba(0,0,0,0.9)"

  ctx.strokeRect(x,y,img.width,img.height)
}
function cardsDrawn(drawnCards, numOfCards){
    var card = {}
    var cardColor
    var cardSuffix
    var cardImages=[]
    if(numOfCards == 1){
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



function decideColor(color){
    switch (color){
        case 'red': return redCards
        case 'blue': return blueCards
        case 'green': return greenCards
        case 'yellow': return yellowCards
        default: return blackCards
    }
}

function drawCardFor(player,j,i){
    switch (j){
        case 0:  drawCard(ctx,backSide, (canvas.width-backSide.width-10), ((canvas.height/2)-(player.noCards)*15)+i*15)
        case 1:  drawCard(ctx,backSide,((canvas.width/2)-(player.noCards-1)*15)+i*15, 10)
        case 2:  drawCard(ctx,backSide, 10, ((canvas.height/2)-(player.noCards)*15)+i*15)
        default: break
    }
}

//játéktér

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

//újrarajzolja a képernyőt
function redraw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);//letörli az eddigit
    var noPlayers = 4
    var cardImages = cardsDrawn(player.cards,player.noCards)
    drawCard(ctx, blueCards.get('draw2'), (canvas.width/2)-(backSide.width/2)-25 , (canvas.height/2)-(backSide.height/2))//középső lap
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
//kiveszi a kirakott lapokat a kezéből
function removeCard(pos){
  player.cards.splice(pos,1)
  var tempcards = []
  for (var i=0; i<player.noCards;i++){
      if(player.cards[i]) tempcards.push(player.cards[i])
  }
  player.cards = tempcards
  player.noCards-=1

}

//kilépő játékos törlése
function deletePlayer(playerId){
  players.splice(playerId,1)
  var temp = []
  for (var i=0; i<players.length;i++){
      if(players[i]) temp.push(players[i])
  }
  players = temp

}


//egérakciók

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
         removeActions.draw()
    }
    for(var i = 0; i<player.noCards; i++){
        imgX = ((canvas.width/2)-(player.noCards-1)*50+i*85)
        imgY = canvas.height-backSide.height-10
        console.log(imgY)
        if(mX>= imgX && mX< imgX+backSide.width && mY >= imgY && mY < imgY + backSide.height){
            console.log("Bent " + i )
            if(player.cards[i].type=="draw4wild" ||player.cards[i].type=="wild") var color = wild()
            remoteActions.place(i,color)
            console.log(player.cards[i])
        }
    }
}

function wild(){
 var color=  prompt("Kérlek, adj meg egy színt, amelyet kiválasztanál!(red/blue/green/yellow)");
 if(color=='red'||color=='blue'||color=='green'||color=='yellow') return color
 else wild()
}
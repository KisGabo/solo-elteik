import { $, $$ } from './helper'

/**
 * Ezek hívódnak meg, ha valami történik a játékban.
 * Ezek frissítik a HTML-t, animálnak, stb, ami csak kell.
 * Bővebb infó: /docs/szerver-iface.md "Szerver --> kliens" rész
 */


// globálisok
var canvas, ctx
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
    

    $('#players').appendChild(newPlayer)

}

/* szerveroldali jelzésre kivesz valakit a listából Id alapján */
export function playerDisconnected (playerId) {
    if(true){
        $('#players').removeChild(document.getElementById("player-"+playerId))
    }else{

    }
}

export function started (data) {

}

export function cardPlaced (data) {

}

export function drawn (data) {

}

export function illegalAction () {

}







export function setPlayer(name){
    player.name = name
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
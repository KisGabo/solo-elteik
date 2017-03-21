import { $, $$ } from './helper'

/**
 * Ezek hívódnak meg, ha valami történik a játékban.
 * Ezek frissítik a HTML-t, animálnak, stb, ami csak kell.
 * Bővebb infó: /docs/szerver-iface.md "Szerver --> kliens" rész
 */

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

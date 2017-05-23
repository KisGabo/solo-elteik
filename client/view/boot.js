import * as remoteActions from '../remoteActions'
import { $, $$ } from './helper'
import * as gameEvents from "./gameEvents"

/**
 * Ez a függvény egyszer lefut, amint betöltött az oldal.
 */
export default function () {

  //ha megnyomja a startot, felugrik egy ablak, ami megkérdezi a nevét
  $('#startBtn').addEventListener('click', newPlayerInit)

  /* ha megkapja a nevet, átirányítja a várakozás oldalára, 
  tovább küldi a connectet a szerver felé */
  function newPlayerInit(){
    var playerName = prompt("Kérlek, add meg a neved!", "Han Solo");
    if (playerName == '') playerName = 'Névtelenke'
    if (playerName != null) { //egyelőre csak placeholderként default szöveg
      $('#welcomePage').style.display = 'none'
      $('#waitArea').style.display = 'block'
      $('#waitArea').innerHTML = "Üdv " + playerName + "! Kérlek várj egy kicsit!" +"<br>" +'<img src="images/view/rolling.svg">'
      remoteActions.connect(playerName)
      gameEvents.setPlayer(playerName)
      waitArea()
    }
  }
  //a várakozó "menü" felépítése
  function waitArea(){
    $('#waitArea').innerHTML += "<br> <h3> Várakozó játékosok: </h3>"

    var players = document.createElement('ul')
    players.setAttribute('id', 'players')

    $('#waitArea').appendChild(players)

    /*setTimeout(function () {
        gameEvents.started({ cards: [{
    color: 'blue',
    type: 'number',
    number: '1'
  }, {
    color: '',
    type: 'wild',
    number: ''
  }, {
    color: '',
    type: 'draw4wild',
    number: ''
  }], firstCard: {
    color: 'red',
    type: 'number',
    number: '1'
  } })
      }, 1000);*/
  }
  //bezárás érzékelése
  window.onbeforeunload = function(){
    remoteActions.disconnect()
  }

  console.log('View boot script kész!')
}

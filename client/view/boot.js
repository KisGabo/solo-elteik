import * as remoteActions from '../remoteActions'

/**
 * Ez a függvény egyszer lefut, amint betöltött az oldal.
 */
export default function () {
  console.log('View boot script kész!')
}

// Segédfüggvények

function $(selector) {
    return document.querySelector(selector)
}

function $$(selector) {
    return document.querySelectorAll(selector)
}

//ha megnyomja a startot, felugrik egy ablak, ami megkérdezi a nevét
$('#startBtn').addEventListener('click', newPlayerInit)

//ha megkapja a nevet, átirányítja a játék oldalára
function newPlayerInit(){
  var playerName = prompt("Please enter your name", "Han Solo");
  if (playerName == '') playerName = 'Névtelenke'
  if (playerName != null) { //egyelőre csak placeholderként default szöveg
    $('#welcomePage').style.display = 'none'
    $('#gameArea').style.display = 'block'
    $('#gameArea').innerHTML = "Hello " + playerName + "! Let's play some Solo!"
  }
}
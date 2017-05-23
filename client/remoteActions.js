/**
 * @file Interfész a szerver <-> UI kommunikációhoz.
 *   A UI az itteni függvényeket hívja meg, mikor a játékos valamit cselekszik.
 * @module Client/RemoteActions
 * @author Bartalos Gábor
 * @see /docs/szerver-iface.md "Kliens --> szerver" rész
 */

const Io = require('socket.io-client')
import * as handlers from './view/gameEvents'

let socket

/**
 * Csatlakozik a szerverre, feliratkozik a UI függvényeivel
 * a szervertől jövő eseményekre.
 * @param {string} name A játékos neve
 */
export function connect (name) {
  socket = Io('http://localhost')

  socket.on('connect', () => {
    console.log('csatlakozva a szerverhez')
    console.log('--> server: join', name)
    socket.emit('join', name)
  })

  socket.on('playerConnected', handlers.playerConnected)
  socket.on('playerDisconnected', handlers.playerDisconnected)
  socket.on('started', handlers.started)
  socket.on('cardPlaced', handlers.cardPlaced)
  socket.on('drawn', handlers.drawn)
  socket.on('illegalAction', handlers.illegalAction)

  window.place = place
  window.draw = draw
}

/**
 * Elhagyja a játékot.
 */
export function disconnect () {
  console.log('--> server: disconnect')
  socket.emit('disconnect')
}

/**
 * Lerak egy kártyalapot.
 * @param {Object} data A szervernek küldendő információ
 * @param {number} data.cardId A lerakni kívánt lap indexe
 * @param {string|number} [data.info] Színváltós lap esetén a kért szín,
 *   csere esetén a játékos sorszáma
 */
export function place (data) {
  console.log('--> server: place', data)
  socket.emit('place', data)
}

/**
 * Húz egyet a pakliból.
 */
export function draw () {
  console.log('--> server: draw')
  socket.emit('draw')
}

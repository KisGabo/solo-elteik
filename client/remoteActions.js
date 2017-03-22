const Io = require('socket.io-client')
import * as handlers from './view/gameEvents'

let socket

/**
 * A view ezeket hívja meg, hogy adatot küldjön a szervernek.
 * Bővebb infó: /docs/szerver-iface.md "Kliens --> szerver" rész
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
  socket.on('started', data => console.log('--> me: started', data))
  socket.on('cardPlaced', data => console.log('--> me: cardplaced', data))
  socket.on('drawn', data => console.log('--> me: drawn', data))
  socket.on('illegalAction', data => console.log('--> me: illegalaction', data))

  window.place = place
  window.draw = draw
}

export function disconnect () {
  console.log('--> server: disconnect')
  socket.emit('disconnect')
}

export function place (data) {
  console.log('--> server: place', data)
  socket.emit('place', data)
}

export function draw () {
  console.log('--> server: draw')
  socket.emit('draw')
}

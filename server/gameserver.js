const Socketio = require('socket.io')
const GameModel = require('./model/SoloGame')
const CardDeck = require('./model/CardDeck')
//const GameModel = class {}

const PLAYERS = 4

class Gameserver {
  
  constructor (httpServer) {
    this._http = httpServer
    this._nextGameId = 1
    this._playersWaiting = new Array(PLAYERS).fill(false)
    this._games = {}
    this._games[1] = { model: null, sockets: {} }
  }

  start () {
    this._io = Socketio(this._http)
    
    this._io.on('connection', (socket) => {
      socket.on('join', this._onJoin.bind(this, socket))
    })
  }

  _onJoin (socket, name) {
    const nextGame = this._games[this._nextGameId]

    // playerId megkeresése (figyelve arra, hogyha valaki lecsatlakozott
    // várakozás közben, betöltsük a "sorszám-lyukat")
    let id
    for (id = 0; this._playersWaiting[id]; ++id) {}
    this._playersWaiting[id] = true

    console.log(`event: join, playerId=${id} (${name})`)

    socket.join(this._nextGameId.toString())
    socket.gameId = this._nextGameId
    socket.playerId = id
    socket.playerName = name
    nextGame.sockets[id] = socket

    // szólunk mindenkinek az új játékosról
    this._io.to(this._nextGameId.toString())
      .emit('playerConnected', { name, id })

    // az új klienst értesítjük az eddig csatlakozott játékosokról
    for (let i = 0; i < PLAYERS; ++i) {
      if (this._playersWaiting[i] && i !== id) {
        socket.emit('playerConnected', {
          id: nextGame.sockets[i].playerId,
          name: nextGame.sockets[i].playerName
        })
      }
    }

    // eseményekre feliratkozás
    socket.on('place', this._onPlace.bind(this, socket))
    socket.on('draw', this._onDraw.bind(this, socket))
    socket.on('disconnect',  this._onDisconnect.bind(this, socket))

    // megvagyunk 4-en, hogy kezdődjön a játék?
    if (this._playersWaiting.every(connected => connected)) {
      console.log(`új játék, gameId=${this._nextGameId}`)

      const model = new GameModel(new CardDeck(), PLAYERS)
      nextGame.model = model

      ++this._nextGameId
      this._playersWaiting = new Array(PLAYERS).fill(false)
      this._games[this._nextGameId] = { model: null, sockets: {} }

      for (let i = 0; i < PLAYERS; ++i) {
        nextGame.sockets[i].emit('started', {
          cards: model.getPlayerCards(i),
          firstCard: model.getCurrentCard()
        })
      }
    }
  }

  _onDisconnect (socket) {
    // ha még azelőtt csatlakozik le, hogy feljegyeztük volna,
    // nem sértődünk meg rajta, szíve-joga
    if (!socket.gameId) return

    const game = this._games[socket.gameId]

    // ha már vége a játéknak, akkor sem kell semmit csinálni
    if (!game) return

    console.log(`event: disconnect, gameId=${socket.gameId}, playerId=${socket.playerId}`)

    if (game.model) {
      // már megy a játék, szóval ki kell törölni a játékból a játékost
      game.model.removePlayer(socket.playerId)
      delete game.sockets[socket.playerId]
    } else {
      // várakozás közben tűnt el
      this._playersWaiting[socket.playerId] = false
      delete game.sockets[socket.playerId]
    }

    this._io.to(socket.gameId.toString())
      .emit('playerDisconnected', socket.playerId)
  }

  _onPlace (socket, data) {
    const game = this._games[socket.gameId]

    // ha nem teheti le a lapot, ne engedjük
    const playerCards = game.model.getPlayerCards(socket.playerId)
    const placedCard = playerCards[data.cardId]
    if (!game.model.canBePlaced(placedCard, socket.playerId)) {
      socket.emit('illegalAction')
      return
    }

    console.log(`event: place, gameId=${socket.gameId}, playerId=${socket.playerId}`, data)

    game.model.place(data.cardId, socket.playerId, data.info)

    // ha vége, akkor szólunk a játékosoknak, és vége
    if (game.model.hasEnded()) {
      this._io.to(socket.gameId.toString())
        .emit('cardPlaced', { card: placedCard, playerId: socket.playerId })

      delete this._games[socket.gameId]
      return
    }

    for (let i = 0; i < PLAYERS; ++i) {
      // disconnected?
      if (!game.sockets[i]) continue

      // változtak a játékos kezében lévő kártyák csere következtében?
      const sendNewCards = (placedCard.type === 'circular' ||
        placedCard.type === 'swap' && (i === socket.playerId || i === data.info))
      
      const toSend = {
        card: placedCard,
        playerId: socket.playerId,
        info: data.info,
        newCards: (sendNewCards ? game.model.getPlayerCards(i) : undefined)
      }

      // csere esetén elküldjük, kinél hány lap van
      if (placedCard.type === 'swap' || placedCard.type === 'circular') {
        toSend.numOfCards = Object.getOwnPropertyNames(game.sockets)
            .map(pid => game.model.getPlayerCards(pid).length)
      }

      game.sockets[i].emit('cardPlaced', toSend)
    }
  }

  _onDraw (socket) {
    const game = this._games[socket.gameId]

    // ha nem ő jön, ne engedjük húzni
    if (game.model.getNextPlayer() !== socket.playerId) {
      socket.emit('illegalAction')
      return
    }

    console.log(`event: draw, gameId=${socket.gameId}, playerId=${socket.playerId}`)

    const drawn = game.model.draw()
    const eventData = { playerId: socket.playerId, numOfCards: drawn.length }

    // szólunk a többieknek a húzásról
    socket.broadcast.to(socket.gameId.toString()).emit('drawn', eventData)

    // a húzó játékost is értesítjük az eseményről,
    // neki az új lapjait is visszaküldjük
    eventData.drawnCards = drawn
    socket.emit('drawn', eventData)
  }

}

module.exports = Gameserver

/**
 * @file Ezzel indul el a szerver
 * @author Bartalos Gábor
 */

const Http = require('http')
const Gameserver = require('./server/gameserver')
const Express = require('express')

console.log('HTTP szerver indítása...')

const app = Express()
const httpServer = Http.createServer(app)
app.use(Express.static('client/public'))
httpServer.listen(80)

console.log('Gameserver indítása...')

const server = new Gameserver(httpServer)
server.start()

console.log('Szerver elindult')

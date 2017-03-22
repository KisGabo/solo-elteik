const Http = require('http')
const Gameserver = require('./server/gameserver')

console.log('HTTP szerver indítása...')

const httpServer = Http.createServer()
httpServer.listen(80)

console.log('Socket IO indítása...')

const server = new Gameserver(httpServer)
server.start()

console.log('Szerver elindult')

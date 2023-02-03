const { DisconnectReason } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')

connection = (sock, startBot) => {
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      shouldReconnect = new Boom(lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) {
        startBot()
      }
    } else if (connection === 'open') {
      console.log('Terhubung')
    }
  })
}

module.exports = { connection }
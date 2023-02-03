const { connection } = require('./connection')
const { messages } = require('./messages')

const { default: MYSBot, useSingleFileAuthState } = require('@adiwajshing/baileys')
const { pino } = require('pino')

async function startBot () {
  const { state, saveState } = await useSingleFileAuthState('./session.json')
  const sock = MYSBot({
    printQRInTerminal: true,
    auth: state,
    logger: pino({level: 'silent'})
  })
  sock.ev.on('creds.update', saveState)

  // connection
  connection(sock, startBot)
  // messages
  messages(sock)
}

startBot()
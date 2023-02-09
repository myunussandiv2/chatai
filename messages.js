const { chatAIHandler } = require('./features/chat_ai')

async function messages(sock) {
  sock.ev.on('messages.upsert', (msg, type) => {
    console.log(JSON.stringify(msg, type, 2))
    const m = msg.messages[0]
    const sender = m.key.remoteJid
    const fromMe = m.key.fromMe
    const text = m.message?.conversation.toLowerCase()
    const key = {
      remoteJid: sender,
      id: m.key.id,
      participant: m.key?.participant
    }
    if(sender === 'status@broadcast' || fromMe) return;
      if (text && typeof text === 'string') {
        if (text === '.ask') {
        sock.sendMessage(sender, { text: 'Masukkan pertanyaan anda\n\nKetik .ask _pertanyaan anda_\nContoh: .ask Siapa penemu Tesla?' })
      } else if (!text.indexOf('.ask')){
        sock.readMessages([key])
        chatAIHandler(text, sender, sock)
      }
    }
  })
}

module.exports = { messages }

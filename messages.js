const { chatAIHandler } = require('./features/chat_ai')

async function messages(sock) {
  sock.ev.on('messages.upsert', (msg, type) => {
    // console.log(JSON.stringify(msg, type, 2))
    const m = msg.messages[0]
    const sender = m.key.remoteJid
    const fromMe = m.key.fromMe
    let text = m.message?.conversation.toLowerCase().split(' ')
    if (m.message?.extendedTextMessage) {
      text = m.message?.extendedTextMessage.text.toLowerCase().split(' ')
    }
    const prefix = ['.', '#', '!']
    const key = {
      remoteJid: sender,
      id: m.key.id,
      participant: m.key?.participant
    }
    if(sender === 'status@broadcast' || fromMe) return;
    try {
      if (prefix.some(p => text[0].startsWith(p))
          || !(prefix.some(p => text[0].startsWith(p)))) {
        if (prefix.some(p => text[0].startsWith(p))) {
          text[0] = text[0].substring(1)
        }
        switch(text[0]) {
          case 'ping':
            sock.readMessages([key])
            sock.sendMessage(sender, {text: 'pong'})
            break;
          case 'menu':
            sock.readMessages([key])
            sock.sendMessage(sender, {
              image: {url: './img/menhera-kun.jpeg'},
              caption: `*fitur Chat Bot AI*
*_______________________*
*ping*
_••>Chat Bot akan menjawab *pong*_

*.ai [pertanyaan]*
_••>Chat Bot akan menjawab pertanyaanmu_
contoh: .ask siapa pencipta Mobil Tesla?

Gunakan prefix: ['.', '#', '!', '']`
            })
            break;
          case 'ask': case 'ai':
            sock.readMessages([key])
            chatAIHandler(m, text, sender, sock)
            break;
        }
      }
    } catch (e) {
      console.log(e)
    }
    //   if (text && typeof text === 'string') {
    //     if (text === '.ask') {
    //     sock.sendMessage(sender, { text: 'Masukkan pertanyaan anda\n\nKetik .ask _pertanyaan anda_\nContoh: .ask Siapa penemu Tesla?' })
    //   } else if (!text.indexOf('.ask')){
    //     sock.readMessages([key])
    //     chatAIHandler(text, sender, sock)
    //   }
    // }
  })
}

module.exports = { messages }

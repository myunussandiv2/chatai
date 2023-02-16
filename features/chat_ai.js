const axios = require('axios')
const { OPENAI_API_KEY } = require('../config')

const chatAIHandler = async (m, text, sender, sock) => {
  text = text.slice(1).join(' ')
  const contextInfo = m.message?.extendedTextMessage?.contextInfo
  if (contextInfo) {
    text = `tolong jawab percakapan ini\n\npesan anda: ${contextInfo?.quotedMessage.conversation}\n\npesan saya: ${text}\n\npesan anda: ?`
  }
  
  const response = await chatAIRequest(text)
  sock.sendMessage(
    sender,
    {text: response.text.trim()},
    {quoted: m}
  )
}

const chatAIRequest = async (text) => {
  const result = {
    success: false,
    text: ""
  }

  return await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/completions',
    data: {
      model: 'text-davinci-003',
      prompt: text,
      max_tokens: 1000,
      temperature: 0
    },
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'in-ID',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  })
    .then((response) => {
      if (response.status === 200) {
        const { choices } = response.data

        if (choices && choices.length) {
          result.success = true
          result.text = choices[0].text
        }
      } else {
        result.text = 'response failed'
      }
      
      return result
    })
    .catch((error) => {
      result.text = `Error ${error.message}`
      return result
    })
}



module.exports = { chatAIHandler }

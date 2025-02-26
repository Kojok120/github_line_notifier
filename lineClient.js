const axios = require('axios');
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// LINE API 経由でメッセージを送信
async function pushMessage(userId, text) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
  };
  const body = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: text
      }
    ]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('Error sending message to LINE:', error);
  }
}

module.exports = {
  pushMessage
};

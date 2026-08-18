const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotifications(messages) {
  const validMessages = messages.filter(m => Expo.isExpoPushToken(m.to));
  const chunks = expo.chunkPushNotifications(validMessages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (err) {
      console.error('Push notification error:', err);
    }
  }
}

module.exports = { sendPushNotifications };
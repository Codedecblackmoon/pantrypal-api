const cron = require('node-cron');
const supabase = require('../config/supabase');
const { sendPushNotifications } = require('../services/expoPush.service');

function startExpiryCheckJob() {
  // Runs every day at 8:00 AM server time
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily expiry check...');

    const today = new Date().toISOString().split('T')[0];

    const { error: expireError } = await supabase
      .from('pantry_items')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'active')
      .lt('expiry_date', today);

    if (expireError) {
      console.error('Failed to auto-mark expired items:', expireError);
    }

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 6);

    const { data: items, error } = await supabase
      .from('pantry_items')
      .select('user_id, name, expiry_date')
      .eq('status', 'active')
      .lte('expiry_date', threeDaysFromNow.toISOString().split('T')[0]);

    if (error || !items?.length) return;

    // Group items by user
    const byUser = items.reduce((acc, item) => {
      (acc[item.user_id] ||= []).push(item.name);
      return acc;
    }, {});

    const userIds = Object.keys(byUser);
    const { data: tokens } = await supabase
      .from('push_tokens')
      .select('user_id, expo_push_token')
      .in('user_id', userIds);

    const messages = tokens.map(t => ({
      to: t.expo_push_token,
      sound: 'default',
      title: 'Food expiring soon!',
      body: `${byUser[t.user_id].join(', ')} will expire soon — use them up!`,
    }));

    await sendPushNotifications(messages);
  });
}

module.exports = startExpiryCheckJob;
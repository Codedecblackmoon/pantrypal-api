const { z } = require('zod');
const supabase = require('../config/supabase');

const registerTokenSchema = z.object({
  expoPushToken: z.string().min(1, 'Push token is required'),
});

async function registerToken(req, res, next) {
  try {
    const { expoPushToken } = registerTokenSchema.parse(req.body);
    const userId = req.user.id;

    // Upsert: if this user already has a token saved, overwrite it.
    // (One user = one active token, matching our push_tokens table design)
    const { data, error } = await supabase
      .from('push_tokens')
      .upsert(
        {
          user_id: userId,
          expo_push_token: expoPushToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Push token registered', data });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid push token' });
    }
    next(err);
  }
}

async function unregisterToken(req, res, next) {
  try {
    const userId = req.user.id;

    const { error } = await supabase
      .from('push_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.status(200).json({ message: 'Push token removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerToken, unregisterToken };
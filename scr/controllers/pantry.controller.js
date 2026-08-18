const supabase = require('../config/supabase');

async function getExpiringSoon(req, res, next) {
  try {
    const userId = req.user.id;
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .lte('expiry_date', threeDaysFromNow.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    res.json({ items: data });
  } catch (err) {
    next(err);
  }
}

async function getInsights(req, res, next) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('pantry_items')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const used = data.filter(i => i.status === 'used').length;
    const expired = data.filter(i => i.status === 'expired').length;
    const total = used + expired;
    const wasteRate = total > 0 ? Math.round((expired / total) * 100) : 0;

    res.json({ used, expired, wasteRate });
  } catch (err) {
    next(err);
  }
}

module.exports = { getExpiringSoon, getInsights };
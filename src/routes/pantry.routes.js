const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { getExpiringSoon, getInsights } = require('../controllers/pantry.controller');

router.get('/expiring-soon', requireAuth, getExpiringSoon);
router.get('/insights', requireAuth, getInsights);

module.exports = router;
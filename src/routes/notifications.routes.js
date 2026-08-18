const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { registerToken, unregisterToken } = require('../controllers/notifications.controller');

router.post('/register-token', requireAuth, registerToken);
router.delete('/unregister-token', requireAuth, unregisterToken);

module.exports = router;
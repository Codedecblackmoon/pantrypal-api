const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { suggestRecipes } = require('../controllers/recipes.controller');

router.post('/suggest', requireAuth, suggestRecipes);

module.exports = router;
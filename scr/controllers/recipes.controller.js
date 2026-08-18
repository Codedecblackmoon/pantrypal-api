const { z } = require('zod');
const { findRecipesByIngredients } = require('../services/spoonacular.service');

const suggestSchema = z.object({
  ingredients: z.array(z.string()).min(1),
});

async function suggestRecipes(req, res, next) {
  try {
    const { ingredients } = suggestSchema.parse(req.body);
    const recipes = await findRecipesByIngredients(ingredients);
    res.json({ recipes });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid ingredients list' });
    }
    next(err);
  }
}

module.exports = { suggestRecipes };
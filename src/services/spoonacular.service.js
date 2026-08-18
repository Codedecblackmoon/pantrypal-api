const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY;

async function findRecipesByIngredients(ingredients) {
  const query = ingredients.join(',');
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=5&apiKey=${SPOONACULAR_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Spoonacular request failed');
  return response.json();
}

module.exports = { findRecipesByIngredients };
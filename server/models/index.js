const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const RecipeIngredient = require('./recipe_ingredient')

Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, as: 'recipeIngredient' })
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, as: 'ingredientList' })

module.exports = {
  Recipe, Ingredient, RecipeIngredient,
}

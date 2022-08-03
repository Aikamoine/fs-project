const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const RecipeIngredient = require('./recipe_ingredient')
const Unit = require('./unit')
const RecipeStep = require('./recipe_step')

Recipe.belongsToMany(Ingredient, { through: RecipeIngredient })
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient })

Recipe.hasMany(RecipeStep)
RecipeStep.belongsTo(Recipe)

module.exports = {
  Recipe,
  Ingredient,
  RecipeIngredient,
  Unit,
  RecipeStep,
}

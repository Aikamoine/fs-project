const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const RecipeIngredient = require('./recipe_ingredient')
const Unit = require('./unit')
const RecipeStep = require('./recipe_step')
const User = require('./user')
const Session = require('./session')
const Shoppinglist = require('./shoppinglist')

Recipe.belongsToMany(Ingredient, { through: RecipeIngredient })
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient })

Recipe.hasMany(RecipeStep)
RecipeStep.belongsTo(Recipe)

User.hasMany(Session)
Session.belongsTo(User)

User.hasMany(Recipe)
Recipe.belongsTo(User)

User.hasMany(Shoppinglist)
Shoppinglist.belongsTo(User)

Ingredient.hasMany(Shoppinglist)
Shoppinglist.belongsTo(Ingredient)

module.exports = {
  Recipe,
  Ingredient,
  RecipeIngredient,
  Unit,
  RecipeStep,
  User,
  Session,
  Shoppinglist,
}

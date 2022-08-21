const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const RecipeIngredient = require('./recipe_ingredient')
const Unit = require('./unit')
const RecipeStep = require('./recipe_step')
const User = require('./user')
const Session = require('./session')
const Shoppinglist = require('./shoppinglist')
const ShoppinglistRecipe = require('./shoppinglist_recipe')

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

User.hasMany(ShoppinglistRecipe)
ShoppinglistRecipe.belongsTo(User)

Recipe.hasMany(ShoppinglistRecipe)
ShoppinglistRecipe.belongsTo(Recipe)

ShoppinglistRecipe.hasMany(Shoppinglist)
Shoppinglist.belongsTo(ShoppinglistRecipe)

module.exports = {
  Recipe,
  Ingredient,
  RecipeIngredient,
  Unit,
  RecipeStep,
  User,
  Session,
  Shoppinglist,
  ShoppinglistRecipe,
}

const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class RecipeIngredients extends Model {}

RecipeIngredients.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'recipes', key: 'id' },
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ingredients', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'recipe_ingredients',
})

module.exports = RecipeIngredients

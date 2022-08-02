const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class RecipeIngredient extends Model {}

RecipeIngredient.init({
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unit: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'recipe_ingredients',
})

module.exports = RecipeIngredient

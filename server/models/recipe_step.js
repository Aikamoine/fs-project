const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class RecipeStep extends Model {}

RecipeStep.init({
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
  step: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'recipe_steps',
})

module.exports = RecipeStep

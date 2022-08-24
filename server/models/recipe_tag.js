const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class RecipeTag extends Model {}

RecipeTag.init({
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
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tags', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'recipe_tags',
})

module.exports = RecipeTag

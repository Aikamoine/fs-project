const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ShoppinglistRecipe extends Model {}

ShoppinglistRecipe.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'recipes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'shoppinglist_recipes',
})

module.exports = ShoppinglistRecipe

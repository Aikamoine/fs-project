const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Recipe extends Model { }
Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    unique: true,
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    min: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'recipe',
})

module.exports = Recipe

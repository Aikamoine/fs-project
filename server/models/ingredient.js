const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Ingredient extends Model { }
Ingredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    unique: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'ingredients',
})

module.exports = Ingredient

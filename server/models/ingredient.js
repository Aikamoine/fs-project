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
  kcal: {
    type: DataTypes.DECIMAL(10, 2),
  },
  fat: {
    type: DataTypes.DECIMAL(10, 2),
  },
  satFat: {
    type: DataTypes.DECIMAL(10, 2),
  },
  carbs: {
    type: DataTypes.DECIMAL(10, 2),
  },
  sugars: {
    type: DataTypes.DECIMAL(10, 2),
  },
  protein: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unitWeight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  volumeWeight: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'ingredients',
})

module.exports = Ingredient

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
  satfat: {
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
  unitweight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  volumeweight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  sideDish: {
    type: DataTypes.BOOLEAN,
  },
  servingSize: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'ingredients',
})

module.exports = Ingredient

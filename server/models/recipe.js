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
    allowNull: false,
    unique: true,
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    min: 0,
  },
  time: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  urlName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  info: {
    type: DataTypes.TEXT,
  },
  usesSideDish: {
    type: DataTypes.BOOLEAN,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'recipes',
})

module.exports = Recipe

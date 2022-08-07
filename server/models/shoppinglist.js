const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Shoppinglist extends Model {}

Shoppinglist.init({
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
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ingredients', key: 'id' },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  unit: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'shoppinglists',
})

module.exports = Shoppinglist

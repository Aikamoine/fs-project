const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Unit extends Model { }
Unit.init({
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
  type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'units',
})

module.exports = Unit

const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Tag extends Model {}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  countServings: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'tags',
})

module.exports = Tag

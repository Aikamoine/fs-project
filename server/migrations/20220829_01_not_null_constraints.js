const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'admin_level', {
      type: DataTypes.INTEGER,
      allowNull: false,
    })
    await queryInterface.changeColumn('recipes', 'name', {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    })
    await queryInterface.changeColumn('recipes', 'url_name', {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    })
    await queryInterface.changeColumn('recipes', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin_level')
  },
}

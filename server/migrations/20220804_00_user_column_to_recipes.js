const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('recipes', 'user_id', {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('recipes')
  },
}

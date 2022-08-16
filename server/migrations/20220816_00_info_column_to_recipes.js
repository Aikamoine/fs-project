const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('recipes', 'info', {
      type: DataTypes.TEXT,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('recipes', 'info')
  },
}

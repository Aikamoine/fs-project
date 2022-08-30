const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('recipes', 'uses_side_dish', {
      type: DataTypes.BOOLEAN,
    })
    await queryInterface.addColumn('ingredients', 'side_dish', {
      type: DataTypes.BOOLEAN,
    })
    await queryInterface.addColumn('ingredients', 'serving_size', {
      type: DataTypes.INTEGER,
    })
    await queryInterface.removeColumn('users', 'is_admin')
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('recipes', 'uses_side_dish')
    await queryInterface.removeColumn('ingredients', 'side_dish')
    await queryInterface.removeColumn('ingredients', 'serving_size')
    await queryInterface.addColumn('users', 'is_admin', {
      type: DataTypes.BOOLEAN,
    })
  },
}

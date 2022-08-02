const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('recipe_ingredients', 'unit_id')
    await queryInterface.dropTable('units')
    await queryInterface.addColumn('recipe_ingredients', 'unit', {
      type: DataTypes.TEXT,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('recipe_ingredients')
  },
}

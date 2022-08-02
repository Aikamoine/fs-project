const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('recipe_ingredients', 'amount', {
      type: DataTypes.DECIMAL(10, 2),
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('recipe_ingredients')
  },
}

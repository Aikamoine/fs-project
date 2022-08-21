const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('shoppinglists', 'shoppinglist_recipe_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'shoppinglist_recipes', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('shoppinglists', 'shoppinglist_recipe_id')
  },
}

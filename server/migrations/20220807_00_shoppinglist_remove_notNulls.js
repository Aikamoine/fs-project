const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('shoppinglists', 'amount', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    })
    await queryInterface.changeColumn('shoppinglists', 'unit', {
      type: DataTypes.TEXT,
      allowNull: true,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('shoppinglists', 'amount', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    })
    await queryInterface.changeColumn('shoppinglists', 'unit', {
      type: DataTypes.TEXT,
      allowNull: false,
    })
  },
}

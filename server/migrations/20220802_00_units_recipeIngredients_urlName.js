const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('units', {
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
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    })
    await queryInterface.addColumn('recipe_ingredients', 'amount', {
      type: DataTypes.DECIMAL(2),
    })
    await queryInterface.addColumn('recipe_ingredients', 'unit_id', {
      type: DataTypes.INTEGER,
      references: { model: 'units', key: 'id' },
    })
    await queryInterface.addColumn('recipes', 'url_name', {
      type: DataTypes.TEXT,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('units')
    await queryInterface.dropTable('recipe_ingredients')
  },
}

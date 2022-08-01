const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('ingredients', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        unique: true,
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
    await queryInterface.createTable('recipe_ingredients', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'recipes', key: 'id' },
      },
      ingredient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ingredients', key: 'id' },
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
    await queryInterface.renameColumn('recipes', 'notes', 'time')
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('ingredients')
    await queryInterface.dropTable('recipe_ingredients')
  },
}

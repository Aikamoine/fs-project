const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('recipe_steps', {
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
      step: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('recipe_steps')
  },
}

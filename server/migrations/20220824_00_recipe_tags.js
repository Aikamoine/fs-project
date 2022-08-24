const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('tags', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      count_servings: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.createTable('recipe_tags', {
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
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
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
    await queryInterface.dropTable('tags')
    await queryInterface.dropTable('recipe_tags')
  },
}

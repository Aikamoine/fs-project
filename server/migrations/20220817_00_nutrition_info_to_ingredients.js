const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('ingredients', 'kcal', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'fat', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'sat_fat', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'carbs', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'sugars', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'protein', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'unit_weight', {
      type: DataTypes.DECIMAL(10, 2),
    })
    await queryInterface.addColumn('ingredients', 'volume_weight', {
      type: DataTypes.DECIMAL(10, 2),
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('ingredients', 'kcal')
    await queryInterface.removeColumn('ingredients', 'fat')
    await queryInterface.removeColumn('ingredients', 'sat_fat')
    await queryInterface.removeColumn('ingredients', 'carbs')
    await queryInterface.removeColumn('ingredients', 'sugars')
    await queryInterface.removeColumn('ingredients', 'protein')
    await queryInterface.removeColumn('ingredients', 'unit_weight')
    await queryInterface.removeColumn('ingredients', 'volume_weight')
  },
}

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('ingredients', 'sat_fat', 'satfat')
    await queryInterface.renameColumn('ingredients', 'unit_weight', 'unitweight')
    await queryInterface.renameColumn('ingredients', 'volume_weight', 'volumeweight')
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn('ingredients', 'satfat', 'sat_fat')
    await queryInterface.renameColumn('ingredients', 'unitweight', 'unit_weight')
    await queryInterface.renameColumn('ingredients', 'volumeweight', 'volume_weight')
  },
}

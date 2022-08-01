const { Recipe } = require('../models')

console.log('RECIPES CONTROLLER YO')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll()
  res.json(recipes)
}

module.exports = {
  getAll,
}

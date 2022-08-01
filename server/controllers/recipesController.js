const { Recipe } = require('../models')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll()
  res.json(recipes)
}

module.exports = {
  getAll,
}

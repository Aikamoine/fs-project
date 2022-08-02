const {
  Recipe,
  Ingredient,
} = require('../models')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll()
  res.json(recipes)
}

const getRecipeDetails = async (req, res) => {
  const details = await Recipe.findOne({
    where: { urlName: req.params.urlName },
    include: [{
      model: Ingredient,
    }],
  })

  console.log('recipe controller details', JSON.stringify(details, null, 2))
  res.json(details)
}

module.exports = {
  getAll,
  getRecipeDetails,
}
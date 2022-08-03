const {
  Recipe,
  Ingredient,
  RecipeStep,
} = require('../models')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll()
  res.json(recipes)
}

const getRecipeDetails = async (req, res) => {
  const details = await Recipe.findOne({
    where: { urlName: req.params.urlName },
    include: [
      {
        model: Ingredient,
      },
      {
        model: RecipeStep,
      },
    ],
    order: [
      [Ingredient, 'id', 'ASC'],
      [RecipeStep, 'number', 'ASC'],
    ],
  })

  res.json(details)
}

module.exports = {
  getAll,
  getRecipeDetails,
}

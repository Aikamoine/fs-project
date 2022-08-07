/* eslint-disable no-await-in-loop */
const jwt = require('jsonwebtoken')
const { sequelize } = require('../util/db')

const { SECRET } = require('../util/common')
const {
  Recipe,
  Ingredient,
  RecipeStep,
  RecipeIngredient,
} = require('../models')
const { tokenIsValid, extractToken } = require('./util')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll({
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(recipes)
}

const getRecipeDetails = async (req, res) => {
  const recipe = await Recipe.findOne({
    where: { urlName: req.params.urlName },
    attributes: ['id', 'name', 'servings', 'time'],
    include: [
      {
        model: RecipeStep,
      },
    ],
    order: [
      [RecipeStep, 'number', 'ASC'],
    ],
  })

  // eslint-disable-next-line no-unused-vars
  const [ingredients, metadata] = await sequelize.query(
    `SELECT RI.id, RI.amount, RI.unit, I.name as name, I.id as ing_id FROM recipe_ingredients RI LEFT JOIN ingredients I on RI.ingredient_id=I.id WHERE RI.recipe_id=${recipe.id} ORDER BY RI.id`,
  )

  const details = { recipe, ingredients }
  res.json(details)
}

const postIngredient = async (ingredient, index, recipeId) => {
  const dbIngredient = await Ingredient.findOrCreate({
    where: { name: ingredient.name },
  })
  await RecipeIngredient.create({
    recipeId,
    ingredientId: dbIngredient[0].id,
    amount: ingredient.amount,
    unit: ingredient.unit,
  })
}

const postStep = async (step, number, recipeId) => {
  await RecipeStep.create({
    recipeId,
    step,
    number: number + 1,
  })
}

const addRecipe = async (req, res) => {
  const token = extractToken(req.get('authorization'))
  const decodedToken = jwt.verify(token, `${SECRET}`)
  if (!(await tokenIsValid(token, decodedToken))) {
    return res.status(401).end()
  }

  const {
    name, servings, time, urlName, ingredients, steps,
  } = req.body

  const recipe = await Recipe.create({
    name,
    servings,
    time,
    urlName,
    userId: decodedToken.id,
  })

  for (let index = 0; index < ingredients.length; index++) {
    await postIngredient(ingredients[index], index, recipe.id)
  }

  for (let index = 0; index < steps.length; index++) {
    await postStep(steps[index], index, recipe.id)
  }

  return res.status(200).end()
}

module.exports = {
  getAll,
  getRecipeDetails,
  addRecipe,
}

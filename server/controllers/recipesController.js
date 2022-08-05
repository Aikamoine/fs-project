/* eslint-disable no-await-in-loop */
const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/common')
const {
  Recipe,
  Ingredient,
  RecipeStep,
  RecipeIngredient,
} = require('../models')
const Session = require('../models/session')

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

const extractToken = (authorization) => {
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenIsValid = async (token, decodedToken) => {
  if (!decodedToken || !decodedToken.id) {
    return false
  }

  const session = await Session.findOne({
    where: { token },
  })
  if (session.validUntil < new Date()) {
    return false
  }
  return true
}

const postIngredient = async (ingredient, recipeId) => {
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
  const {
    name, servings, time, urlName, ingredients, steps,
  } = req.body

  const decodedToken = jwt.verify(token, `${SECRET}`)
  if (!(await tokenIsValid(token, decodedToken))) {
    return res.status(401).end()
  }

  const recipe = await Recipe.create({
    name,
    servings,
    time,
    urlName,
    userId: decodedToken.id,
  })

  for (let index = 0; index < ingredients.length; index++) {
    await postIngredient(ingredients[index], recipe.id)
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

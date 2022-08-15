/* eslint-disable no-await-in-loop */
const { sequelize } = require('../util/db')

const {
  Recipe,
  Ingredient,
  RecipeStep,
  RecipeIngredient,
} = require('../models')

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll({
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(recipes)
}

const getIngredientNames = async (req, res) => {
  const ingredients = await Ingredient.findAll({
    attributes: ['name'],
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(ingredients)
}

const getRecipeDetails = async (req, res) => {
  const recipe = await Recipe.findOne({
    where: { urlName: req.params.urlName },
    attributes: ['id', 'name', 'servings', 'time', 'user_id'],
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
  if (!req.decodedToken.isAdmin) {
    return res.status(401).json({
      error: 'Käyttöoikeutesi ei riitä reseptien lisäämiseen',
    })
  }

  const {
    name, servings, time, urlName, ingredients, steps,
  } = req.body

  const recipe = await Recipe.create({
    name,
    servings,
    time,
    urlName,
    userId: req.decodedToken.id,
  })

  for (let index = 0; index < ingredients.length; index++) {
    await postIngredient(ingredients[index], index, recipe.id)
  }

  for (let index = 0; index < steps.length; index++) {
    await postStep(steps[index], index, recipe.id)
  }

  return res.status(200).end()
}

const editRecipe = async (req, res) => {
  const {
    recipe,
    newName,
    newServings,
    newTime,
    newIngredients,
    newSteps,
  } = req.body

  if (!req.decodedToken.isAdmin && req.decodedToken.id !== recipe.user_id) {
    return res.status(401).json({
      error: 'Käyttöoikeutesi ei riitä tämän reseptin muokkaamiseen',
    })
  }

  const ingredientBulkArray = newIngredients.map((i) => ({
    recipeId: recipe.id,
    ingredientId: i.ing_id,
    amount: i.amount,
    unit: i.unit,
  }))

  const stepsBulkArray = newSteps.map((s, index) => ({
    recipeId: recipe.id,
    step: s.step,
    number: index + 1,
  }))

  await RecipeIngredient.destroy({
    where: { recipeId: recipe.id },
  })

  await RecipeStep.destroy({
    where: { recipeId: recipe.id },
  })

  await RecipeIngredient.bulkCreate(ingredientBulkArray)
  await RecipeStep.bulkCreate(stepsBulkArray)

  await Recipe.update(
    {
      name: newName,
      servings: newServings,
      time: newTime,
    },
    {
      where: { id: recipe.id },
    },
  )

  return res.status(200).end()
}

module.exports = {
  getAll,
  getRecipeDetails,
  addRecipe,
  getIngredientNames,
  editRecipe,
}

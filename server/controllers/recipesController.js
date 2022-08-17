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
    attributes: ['id', 'name', 'servings', 'time', 'user_id', 'info'],
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

const addRecipe = async (req, res) => {
  if (!req.decodedToken.isAdmin) {
    return res.status(401).json({
      error: 'Käyttöoikeutesi ei riitä reseptien lisäämiseen',
    })
  }

  const {
    name, servings, time, info, urlName, ingredients, steps,
  } = req.body

  try {
    const recipe = await Recipe.create({
      name,
      servings,
      time,
      info,
      urlName,
      userId: req.decodedToken.id,
    })

    const ingredientBulkArray = ingredients.map((ingredient) => ({
      recipeId: recipe.id,
      ingredientId: ingredient.ingredient.id,
      amount: ingredient.amount || null,
      unit: ingredient.unit,
    }))

    const stepsBulkArray = steps.map((step, index) => ({
      recipeId: recipe.id,
      step,
      number: index + 1,
    }))

    console.log('recipe', JSON.stringify(recipe, null, 2))
    console.log('ingredients', ingredientBulkArray)
    console.log('steps', stepsBulkArray)
    await RecipeIngredient.bulkCreate(ingredientBulkArray)
    await RecipeStep.bulkCreate(stepsBulkArray)

    return res.status(200).end()
  } catch (error) {
    console.error(error)
    return res.json({ message: 'Lisäyksessä tapahtui virhe. Tarkista reseptin tiedot selailusta.' })
  }
}

const editRecipe = async (req, res) => {
  const {
    recipe,
    newName,
    newServings,
    newTime,
    newInfo,
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
    amount: i.amount || null,
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
      info: newInfo,
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

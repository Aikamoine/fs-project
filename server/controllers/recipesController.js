const { adminLevels } = require('@util/common')
const { sequelize } = require('../util/db')

const {
  Recipe,
  RecipeStep,
  RecipeIngredient,
  Tag,
  RecipeTag,
  ShoppinglistRecipe,
  Shoppinglist,
  Ingredient,
} = require('../models')

const deleteRecipesShoppinglists = async (recipeId) => {
  const shoppinglistRecipes = await ShoppinglistRecipe.findAll({
    where: { recipeId },
  })

  if (shoppinglistRecipes) {
    await Shoppinglist.destroy({
      where: {
        shoppinglistRecipeId: shoppinglistRecipes.map((i) => i.id),
      },
    })
    await ShoppinglistRecipe.destroy({
      where: { recipeId },
    })
  }
}

const createRecipeData = async (recipeId, ingredients, steps, tags) => {
  const ingredientBulkArray = ingredients.map((ingredient) => ({
    recipeId,
    ingredientId: ingredient.id,
    amount: ingredient.amount || null,
    unit: ingredient.unit,
  }))

  const stepsBulkArray = steps.map((step, index) => ({
    recipeId,
    step,
    number: index + 1,
  }))

  const tagBulkArray = tags.map((tag) => ({
    recipeId,
    tagId: tag.value,
  }))

  await RecipeIngredient.bulkCreate(ingredientBulkArray)
  await RecipeStep.bulkCreate(stepsBulkArray)
  await RecipeTag.bulkCreate(tagBulkArray)
}

const getAll = async (req, res) => {
  const recipes = await Recipe.findAll({
    include: [{
      model: Tag,
      attributes: ['name'],
      through: {
        attributes: [],
      },
    }],
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(recipes)
}

const getRecipeDetails = async (req, res) => {
  const recipe = await Recipe.findOne({
    where: { urlName: req.params.urlName },
    attributes: ['id', 'name', 'servings', 'time', 'userId', 'info', 'usesSideDish'],
    include: [
      {
        model: RecipeStep,
      },
      {
        model: Tag,
        attributes: [['name', 'label'], ['id', 'value']],
        through: {
          attributes: [],
        },
      },
    ],
    order: [
      [RecipeStep, 'number', 'ASC'],
    ],
  })

  const ingredients = await sequelize.query(
    `SELECT RI.amount, RI.unit, I.name as name, I.id as id, I.kcal, I.fat, I.satfat, I.carbs, I.sugars, I.protein, I.unitweight, I.volumeweight 
    FROM recipe_ingredients RI
    LEFT JOIN ingredients I on RI.ingredient_id=I.id
    WHERE RI.recipe_id=${recipe.id} 
    ORDER BY RI.id`,
    { type: sequelize.QueryTypes.SELECT },
  )

  let sideDishes
  if (recipe.usesSideDish) {
    sideDishes = await Ingredient.findAll({
      where: { sideDish: true },
    })
  }
  const details = { recipe, ingredients, sideDishes }
  res.json(details)
}

const addRecipe = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('editor')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä reseptien lisäämiseen',
    })
  }

  const {
    name, servings, time, info, usesSideDish, urlName, ingredients, steps, tags,
  } = req.body

  try {
    const recipe = await Recipe.create({
      name,
      servings,
      time,
      info,
      usesSideDish,
      urlName,
      userId: req.decodedToken.id,
    })

    await createRecipeData(recipe.id, ingredients, steps, tags)

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
    usesSideDish,
    newIngredients,
    newSteps,
    newTags,
  } = req.body

  if (req.decodedToken.adminLevel < adminLevels('admin') && req.decodedToken.id !== recipe.userId) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä tämän reseptin muokkaamiseen',
    })
  }

  deleteRecipesShoppinglists(recipe.id)

  await RecipeIngredient.destroy({
    where: { recipeId: recipe.id },
  })

  await RecipeStep.destroy({
    where: { recipeId: recipe.id },
  })

  await RecipeTag.destroy({
    where: { recipeId: recipe.id },
  })

  await createRecipeData(recipe.id, newIngredients, newSteps, newTags)

  await Recipe.update(
    {
      name: newName,
      servings: newServings,
      time: newTime,
      info: newInfo,
      usesSideDish,
    },
    {
      where: { id: recipe.id },
    },
  )

  return res.status(200).end()
}

const deleteRecipe = async (req, res) => {
  const { id } = req.params

  if (req.decodedToken.adminLevel < adminLevels('admin')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä reseptien poistamiseen',
    })
  }

  try {
    deleteRecipesShoppinglists(id)

    await RecipeIngredient.destroy({
      where: { recipeId: id },
    })
    await RecipeStep.destroy({
      where: { recipeId: id },
    })
    await RecipeTag.destroy({
      where: { recipeId: id },
    })

    await Recipe.destroy({
      where: { id },
    })
    return res.status(200).end()
  } catch (error) {
    return res.status(500).json({
      error: 'Poistossa tapahtui virhe',
    })
  }
}

module.exports = {
  getAll,
  getRecipeDetails,
  addRecipe,
  editRecipe,
  deleteRecipe,
}

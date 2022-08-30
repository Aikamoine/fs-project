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
        attributes: ['name', 'id'],
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
    `SELECT RI.id, RI.amount, RI.unit, I.name as name, I.id as ing_id, I.kcal, I.fat, I.satfat, I.carbs, I.sugars, I.protein, I.unitweight, I.volumeweight 
    FROM recipe_ingredients RI
    LEFT JOIN ingredients I on RI.ingredient_id=I.id
    WHERE RI.recipe_id=${recipe.id} 
    ORDER BY RI.id`,
    { type: sequelize.QueryTypes.SELECT },
  )

  console.log('recipe uses sidedish', recipe.usesSideDish)
  let sideDishes
  if (recipe.usesSideDish) {
    sideDishes = await Ingredient.findAll({
      where: { sideDish: true },
    })
    console.log('sidedishes', JSON.stringify(sideDishes, null, 2))
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
    name, servings, time, info, urlName, ingredients, steps, tags,
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

    const tagBulkArray = tags.map((tag) => ({
      recipeId: recipe.id,
      tagId: tag.value,
    }))

    await RecipeIngredient.bulkCreate(ingredientBulkArray)
    await RecipeStep.bulkCreate(stepsBulkArray)
    await RecipeTag.bulkCreate(tagBulkArray)

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
    newTags,
  } = req.body

  if (req.decodedToken.adminLevel < adminLevels('admin') && req.decodedToken.id !== recipe.userId) {
    return res.status(403).json({
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

  const tagBulkArray = newTags.map((tag) => ({
    recipeId: recipe.id,
    tagId: tag.value,
  }))

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

  await RecipeIngredient.bulkCreate(ingredientBulkArray)
  await RecipeStep.bulkCreate(stepsBulkArray)
  await RecipeTag.bulkCreate(tagBulkArray)

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

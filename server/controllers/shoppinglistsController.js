/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { Op } = require('sequelize')

const {
  Ingredient,
  Shoppinglist,
  ShoppinglistRecipe,
  Recipe,
  RecipeIngredient,
} = require('../models')

const getList = async (req, res) => {
  const list = await Shoppinglist.findAll({
    attributes: ['id', 'amount', 'unit'],
    include: [
      {
        model: Ingredient,
        attributes: ['name'],
      },
    ],
    where: { userId: req.decodedToken.id },
  })

  return res.json(list)
}

const getListRecipes = async (req, res) => {
  const recipes = await ShoppinglistRecipe.findAll({
    include: {
      model: Recipe,
      attributes: ['name', 'servings'],
    },
    where: { userId: req.decodedToken.id },
  })
  return res.json(recipes)
}

const deleteList = async (req, res) => {
  await Shoppinglist.destroy({
    where: { userId: req.decodedToken.id },
  })

  await ShoppinglistRecipe.destroy({
    where: { userId: req.decodedToken.id },
  })

  return res.status(200).end()
}

const deleteSelected = async (req, res) => {
  const toDestroy = req.body

  await Shoppinglist.destroy({
    where: {
      [Op.and]: [
        {
          userId: req.decodedToken.id,
        },
        { id: toDestroy },
      ],
    },
  })

  return res.status(200).end()
}

const deConstructVolumes = (amount, unit) => {
  let checkedAmount = amount
  let checkedUnit = unit

  if (/^mm$|^tl$|^rkl$|^dl$/.test(unit)) {
    checkedUnit = 'ml'

    if (unit === 'tl') {
      checkedAmount = amount * 5
    } else if (unit === 'rkl') {
      checkedAmount = amount * 15
    } else if (unit === 'dl') {
      checkedAmount = amount * 100
    }
  }

  return { amount: checkedAmount, unit: checkedUnit }
}

const addItemToList = async (item, userId) => {
  const ingredientId = item.ing_id
  const { amount, unit } = deConstructVolumes(item.amount, item.unit)
  // eslint-disable-next-line no-unused-vars
  const [existingItem, created] = await Shoppinglist.findOrCreate({
    where: {
      unit,
      ingredientId,
      userId,
    },
    defaults: {
      amount: 0,
    },
  })

  existingItem.amount = Number(existingItem.amount) + Number(amount)
  await existingItem.save()
}

const addToList = async (req, res) => {
  const { ingredients, id } = req.body

  for (let index = 0; index < ingredients.length; index++) {
    await addItemToList(ingredients[index], req.decodedToken.id)
  }

  await ShoppinglistRecipe.create({
    userId: req.decodedToken.id,
    recipeId: id,
  })

  return res.status(200).end()
}

const removeRecipe = async (req, res) => {
  console.log('remove recipe', req.body)
  const { userId, recipeId } = req.body

  if (req.decodedToken.id !== userId) {
    return res.status(401).json({
      error: 'Käyttäjä ja ostoslistan kohde eivät täsmää',
    })
  }

  const currentList = await Shoppinglist.findAll({
    where: { userId },
  })

  const recipeIngredients = await RecipeIngredient.findAll({
    where: { recipeId },
  })

  currentList.forEach((ingredient) => {
    const listItems = recipeIngredients.filter((i) => i.ingredientId === ingredient.ingredientId)
    listItems.forEach((listItem) => {
      const deconstructed = deConstructVolumes(listItem.amount, listItem.unit)
      console.log('deconstructed', listItem.ingredientId, deconstructed)
      if (ingredient.unit === deconstructed.unit) {
        console.log('yksikkö täsmää')
        if (Number(ingredient.amount) > deconstructed.amount) {
          console.log('vähennetään')
          ingredient.amount = Number(ingredient.amount) - Number(deconstructed.amount)
        } else {
          console.log('nollataan')
          ingredient.amount = 0
        }
      }
    })
  })

  const updatedList = []
  currentList.forEach((ingredient) => {
    if (ingredient.amount !== 0 || !ingredient.unit) {
      updatedList.push({
        userId,
        ingredientId: ingredient.ingredientId,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })
    }
  })
  console.log('updatedList', updatedList)

  await Shoppinglist.destroy({
    where: { userId },
  })
  console.log('DESTROYED')
  await Shoppinglist.bulkCreate(updatedList)
  console.log('CREATED')
  const shoppingListRecipe = await ShoppinglistRecipe.findOne({
    where: { userId, recipeId },
  })

  if (shoppingListRecipe) {
    await shoppingListRecipe.destroy()
  }
  return res.status(200).end()
}

module.exports = {
  getList,
  getListRecipes,
  addToList,
  deleteList,
  deleteSelected,
  removeRecipe,
}

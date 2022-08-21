const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

const {
  Shoppinglist,
  ShoppinglistRecipe,
  Recipe,
} = require('../models')

const getList = async (req, res) => {
  const list = await sequelize.query(
    `SELECT I.name, I.id, SUM(S.amount) as amount, S.unit
    FROM shoppinglists S
    LEFT JOIN ingredients I on I.id=S.ingredient_id
    WHERE S.user_id=${req.decodedToken.id}
    GROUP BY I.name, I.id, S.unit`,
    { type: sequelize.QueryTypes.SELECT },
  )
  console.log('got list', list)
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
/*
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
*/
const addToList = async (req, res) => {
  const { ingredients, id } = req.body
  console.log('addtoList', req.body)

  const shoppinglistRecipe = await ShoppinglistRecipe.create({
    userId: req.decodedToken.id,
    recipeId: id,
  })

  console.log('shoppinglistrecipe', JSON.stringify(shoppinglistRecipe, null, 2))
  const bulkArray = ingredients.map((ingredient) => (
    {
      userId: req.decodedToken.id,
      ingredientId: ingredient.ing_id,
      amount: ingredient.amount,
      unit: ingredient.unit,
      shoppinglistRecipeId: shoppinglistRecipe.id,
    }
  ))

  console.log(bulkArray)
  await Shoppinglist.bulkCreate(bulkArray)

  return res.status(200).end()
}

const removeRecipe = async (req, res) => {
  const { userId } = req.body
  const shoppinglistRecipeId = req.body.id

  if (req.decodedToken.id !== userId) {
    return res.status(401).json({
      error: 'Käyttäjä ja ostoslistan kohde eivät täsmää',
    })
  }

  await Shoppinglist.destroy({
    where: { shoppinglistRecipeId },
  })

  await ShoppinglistRecipe.destroy({
    where: {
      id: shoppinglistRecipeId,
    },
  })

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

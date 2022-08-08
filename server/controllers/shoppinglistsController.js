/* eslint-disable no-await-in-loop */
const { Op } = require('sequelize')

const {
  Ingredient,
  Shoppinglist,
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

const deleteList = async (req, res) => {
  await Shoppinglist.destroy({
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

  if (/mm|tl|rkl|dl/.test(unit)) {
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
  const { ingredients } = req.body

  for (let index = 0; index < ingredients.length; index++) {
    await addItemToList(ingredients[index], req.decodedToken.id)
  }
  return res.status(200).end()
}

module.exports = {
  getList,
  addToList,
  deleteList,
  deleteSelected,
}
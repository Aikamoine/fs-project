/* eslint-disable no-await-in-loop */
const jwt = require('jsonwebtoken')
const { extractToken, tokenIsValid } = require('./util')

const { SECRET } = require('../util/common')
const {
  Ingredient,
  Shoppinglist,
} = require('../models')

const getList = async (req, res) => {
  const token = extractToken(req.get('authorization'))
  const decodedToken = jwt.verify(token, `${SECRET}`)
  if (!(await tokenIsValid(token, decodedToken))) {
    return res.status(401).end()
  }

  const list = await Shoppinglist.findAll({
    attributes: ['amount', 'unit'],
    include: [
      {
        model: Ingredient,
        attributes: ['name'],
      },
    ],
    where: { userId: decodedToken.id },
  })

  return res.json(list)
}

const deleteList = async (req, res) => {
  const token = extractToken(req.get('authorization'))
  const decodedToken = jwt.verify(token, `${SECRET}`)
  if (!(await tokenIsValid(token, decodedToken))) {
    return res.status(401).end()
  }

  await Shoppinglist.destroy({
    where: { userId: decodedToken.id },
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
  const token = extractToken(req.get('authorization'))
  const decodedToken = jwt.verify(token, `${SECRET}`)
  if (!(await tokenIsValid(token, decodedToken))) {
    return res.status(401).end()
  }
  const { ingredients } = req.body

  for (let index = 0; index < ingredients.length; index++) {
    await addItemToList(ingredients[index], decodedToken.id)
  }
  return res.status(200).end()
}

module.exports = {
  getList,
  addToList,
  deleteList,
}

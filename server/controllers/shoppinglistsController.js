const { sequelize } = require('../util/db')

const {
  Shoppinglist,
  ShoppinglistRecipe,
  Recipe,
  Tag,
} = require('../models')

const getList = async (req, res) => {
  const list = await sequelize.query(
    `SELECT I.name, I.id, SUM(S.amount) as amount, S.unit
    FROM shoppinglists S
    LEFT JOIN ingredients I on I.id=S.ingredient_id
    WHERE S.user_id=${req.decodedToken.id}
    GROUP BY I.name, I.id, S.unit
    ORDER BY I.name`,
    { type: sequelize.QueryTypes.SELECT },
  )
  return res.json(list)
}

const getListRecipes = async (req, res) => {
  const recipes = await ShoppinglistRecipe.findAll({
    include: {
      model: Recipe,
      attributes: ['name', 'servings'],
      include: {
        model: Tag,
        through: {
          attributes: [],
        },
      },
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
  console.log('DESTROYING', toDestroy)

  await Shoppinglist.destroy({
    where: {
      userId: req.decodedToken.id,
      ingredientId: toDestroy,
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

const addToList = async (req, res) => {
  const { ingredients, id } = req.body

  const shoppinglistRecipe = await ShoppinglistRecipe.create({
    userId: req.decodedToken.id,
    recipeId: id,
  })

  const bulkArray = []
  ingredients.forEach((ingredient) => {
    const deconstructedVolumes = deConstructVolumes(ingredient.amount, ingredient.unit)
    bulkArray.push({
      userId: req.decodedToken.id,
      ingredientId: ingredient.id,
      amount: deconstructedVolumes.amount,
      unit: deconstructedVolumes.unit,
      shoppinglistRecipeId: shoppinglistRecipe.id,
    })
  })

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

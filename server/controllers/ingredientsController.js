const https = require('https')
const {
  Ingredient,
  RecipeIngredient,
  Shoppinglist,
} = require('../models')
const { sequelize } = require('../util/db')

const getIngredients = async (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const [ingredients, metadata] = await sequelize.query(
    // 'SELECT I.id, I.name, COUNT(RI.id), false as edited FROM ingredients I, recipe_ingredients RI WHERE I.id = RI.ingredient_id GROUP BY I.name, I.id ORDER BY name',
    `SELECT I.id, I.name, COUNT(RI.id), false as edited
    FROM ingredients I
    LEFT JOIN recipe_ingredients RI on I.id=RI.ingredient_id
    GROUP BY I.name, I.id
    ORDER BY I.name`,
  )

  res.json(ingredients)
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

const addIngredient = async (req, res) => {
  const ingredient = req.body
  const added = await Ingredient.create({
    name: ingredient.name.toLowerCase(),
  })
  res.json(added)
}

const getFineliIngredients = async (req, res) => {
  const { id } = req.params
  console.log('server getting fineli', id)
  const url = `https://fineli.fi/fineli/api/v1/foods/${id}`
  https.get(url, (response) => {
    let body = ''

    response.on('data', (chunk) => {
      body += chunk
    })

    response.on('end', () => {
      try {
        const json = JSON.parse(body)
        res.json(json)
      } catch (error) {
        console.error(error.message)
      }
    })
  }).on('error', (error) => {
    console.error(error.message)
  })
}

const replaceIngredient = async (req, res) => {
  const ingredient = req.body
  const originalName = await Ingredient.findOne({
    where: { id: ingredient.id },
    attributes: ['name'],
  })
  const targetEntry = await Ingredient.findOne({
    where: { name: ingredient.name },
  })

  if (targetEntry) {
    await Shoppinglist.update(
      { ingredientId: targetEntry.id },
      {
        where: { ingredientId: ingredient.id },
      },
    )

    await RecipeIngredient.update(
      { ingredientId: targetEntry.id },
      {
        where: { ingredientId: ingredient.id },
      },
    )

    await Ingredient.destroy({
      where: { id: ingredient.id },
    })

    res.json({ message: `Päivitetty kaikki ainesosat '${originalName.name}' nimen '${targetEntry.name}' alle` })
  } else {
    const newIngredient = await Ingredient.update(
      { name: ingredient.name.toLowerCase() },
      {
        where: { id: ingredient.id },
        returning: true,
      },
    )
    res.json({ message: `Korvattu '${originalName.name}' ainesosalla '${newIngredient[1][0].name}'` })
  }
}

const deleteIngredient = async (req, res) => {
  const id = Number(req.params.id)
  const destroyQuery = await sequelize.query(
    `SELECT I.id, I.name, COUNT(RI.id)
    FROM ingredients I
    LEFT JOIN recipe_ingredients RI on I.id=RI.ingredient_id
    WHERE I.id=${id}
    GROUP BY I.name, I.id
    ORDER BY I.name`,
    { type: sequelize.QueryTypes.SELECT },
  )

  const toDestroy = destroyQuery[0]

  if (Number(toDestroy.count) !== 0) {
    return res.status(400).json({
      error: 'Tuhottavalla ainesosalla on reseptiriippuvuuksia',
    })
  }

  const destroyed = await Ingredient.destroy({
    where: { id: toDestroy.id },
  })

  if (destroyed === 1) {
    return res.json({ message: `Poistettu ${toDestroy.name} kannasta` })
  }

  return res.json({ message: `${toDestroy.name} poistaminen epäonnistui` })
}

module.exports = {
  getIngredients,
  getIngredientNames,
  addIngredient,
  // editIngredients,
  getFineliIngredients,
  replaceIngredient,
  deleteIngredient,
}

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
    `SELECT I.id, I.name, COUNT(RI.id), I.kcal, I.fat, I.sat_fat, I.carbs, I.sugars, I.protein, I.unit_weight, I.volume_weight, false as edited, false as details
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
  try {
    const ingredient = req.body
    const {
      name, kcal, fat, carbs, sugars, protein,
    } = req.body

    console.log(ingredient)
    const added = await Ingredient.create({
      name: name.toLowerCase(),
      kcal,
      fat,
      satFat: req.body.sat_fat,
      carbs,
      sugars,
      protein,
      unitWeight: req.body.unit_weight,
      volumeWeight: req.body.volume_weight,
    })

    res.json({ message: `Lisätty ${added.name}` })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Lisäyksessä tapahtui virhe. Ainesosa on todennäköisesti jo olemassa.' })
  }
}

const getFineliIngredients = async (req, res) => {
  const { id } = req.params
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

const https = require('https')
const {
  Ingredient,
  RecipeIngredient,
  Shoppinglist,
} = require('../models')
const { sequelize } = require('../util/db')

const getIngredients = async (req, res) => {
  const ingredients = await sequelize.query(
    `SELECT I.id, I.name, I.name as originalname, COUNT(RI.id), I.kcal, I.fat, I.satfat, I.carbs, I.sugars, I.protein, I.unitweight, I.volumeweight, false as edited, false as details
    FROM ingredients I
    LEFT JOIN recipe_ingredients RI on I.id=RI.ingredient_id
    GROUP BY I.name, I.id
    ORDER BY I.name`,
    { type: sequelize.QueryTypes.SELECT },
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
    const {
      name, kcal, fat, carbs, sugars, protein, satfat, unitweight, volumeweight,
    } = req.body

    const added = await Ingredient.create({
      name: name.toLowerCase(),
      kcal,
      fat,
      satfat,
      carbs,
      sugars,
      protein,
      unitweight,
      volumeweight,
    })

    return res.json({ message: `Lisätty ${added.name}` })
  } catch (error) {
    return res.status(400).json({
      error: 'Lisäyksessä tapahtui virhe. Ainesosa on todennäköisesti jo olemassa.',
    })
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
        res.status(400).json({
          error: 'Finelistä ei löytynyt ainesosaa',
        })
      }
    })
  }).on('error', (error) => {
    console.error(error.message)
  })
}

const updateIngredient = async (req, res) => {
  const ingredient = req.body

  try {
    const targetEntry = await Ingredient.findOne({
      where: { name: ingredient.name },
    })

    if (targetEntry && targetEntry.name !== ingredient.originalname) {
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

      res.json({ message: `Päivitetty kaikki ainesosat '${ingredient.originalname}' nimen '${targetEntry.name}' alle` })
    } else {
      const {
        name, kcal, fat, carbs, sugars, protein, satfat, unitweight, volumeweight,
      } = req.body

      const newIngredient = await Ingredient.update(
        {
          name: name.toLowerCase(),
          kcal,
          fat,
          satfat,
          carbs,
          sugars,
          protein,
          unitweight,
          volumeweight,
        },
        {
          where: { id: ingredient.id },
          returning: true,
        },
      )
      if (ingredient.originalname === newIngredient[1][0].name) {
        res.json({ message: `Päivitetty ainesosan ${ingredient.originalname} tiedot` })
      } else {
        res.json({ message: `Korvattu '${ingredient.originalname}' ainesosalla '${newIngredient[1][0].name}'` })
      }
    }
  } catch (error) {
    res.status(400).json({
      error,
    })
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
  getFineliIngredients,
  updateIngredient,
  deleteIngredient,
}

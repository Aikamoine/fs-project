const https = require('https')
const { adminLevels } = require('@util/common')
const {
  Ingredient,
  RecipeIngredient,
  Shoppinglist,
} = require('../models')
const { sequelize } = require('../util/db')

const getIngredients = async (req, res) => {
  const ingredients = await sequelize.query(
    `SELECT I.id, I.name, I.name as originalname, COUNT(RI.id),
    I.kcal, I.fat, I.satfat, I.carbs, I.sugars, I.protein,
    I.unitweight, I.volumeweight, I.side_dish as sidedish, I.serving_size as servingsize, false as edited, false as details
    FROM ingredients I
    LEFT JOIN recipe_ingredients RI on I.id=RI.ingredient_id
    GROUP BY I.name, I.id
    ORDER BY I.name`,
    { type: sequelize.QueryTypes.SELECT },
  )
  res.json(ingredients)
}

const addIngredient = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('editor')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä ainesosien lisäämiseen',
    })
  }

  try {
    const {
      name, kcal, fat, carbs, sugars, protein, satfat, unitweight, volumeweight, sidedish, servingsize,
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
      sideDish: sidedish,
      servingSize: servingsize,
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
    res.status(500).json({
      error,
    })
  })
}

const updateIngredient = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('editor')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä ainesosien muokkaamiseen',
    })
  }

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

      return res.json({ message: `Päivitetty kaikki ainesosat '${ingredient.originalname}' nimen '${targetEntry.name}' alle` })
    }

    const {
      name, kcal, fat, carbs, sugars, protein, satfat, unitweight, volumeweight, sidedish, servingsize,
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
        sideDish: sidedish,
        servingSize: servingsize,
      },
      {
        where: { id: ingredient.id },
        returning: true,
      },
    )
    if (ingredient.originalname === newIngredient[1][0].name) {
      return res.json({ message: `Päivitetty ainesosan ${ingredient.originalname} tiedot` })
    }
    return res.json({ message: `Korvattu '${ingredient.originalname}' ainesosalla '${newIngredient[1][0].name}'` })
  } catch (error) {
    return res.status(400).json({
      error,
    })
  }
}

const deleteIngredient = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('editor')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä ainesosien poistamiseen',
    })
  }
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
  addIngredient,
  getFineliIngredients,
  updateIngredient,
  deleteIngredient,
}

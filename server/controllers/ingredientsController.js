const {
  Ingredient,
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

const editIngredients = async (req, res) => {
  const newEntries = req.body.filter((i) => i.id < 1)
  const entriesToPost = newEntries.map((i) => ({ name: i.name.toLowerCase() }))
  const edited = req.body.filter((i) => i.id > 0)

  const created = await Ingredient.bulkCreate(entriesToPost)

  edited.forEach((i) => {
    Ingredient.update(
      { name: i.name.toLowerCase() },
      { where: { id: i.id } },
    )
  })

  res.json([...created, ...edited])
}

module.exports = {
  getIngredients,
  getIngredientNames,
  editIngredients,
}

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

  console.log('token', decodedToken)
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
  console.log(JSON.stringify(list, null, 2))
  return res.json(list)
}

module.exports = {
  getList,
}

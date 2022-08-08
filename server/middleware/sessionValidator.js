const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/common')

const { Session } = require('../models')

const extractToken = (authorization) => {
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenIsValid = async (token, decodedToken) => {
  if (!decodedToken || !decodedToken.id) {
    return false
  }

  const session = await Session.findOne({
    where: { token },
  })
  if (!session || session.validUntil < new Date()) {
    return false
  }
  return true
}

// eslint-disable-next-line consistent-return
const sessionValidator = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization) {
    const token = extractToken(req.get('authorization'))
    const decodedToken = jwt.verify(token, `${SECRET}`)
    if (!(await tokenIsValid(token, decodedToken))) {
      return res.status(401).json({
        error: 'Palvelimen puolen sessio ei ole voimassa\nkoita kirjautua uudelleen',
      })
    }
    req.decodedToken = decodedToken
  }

  if (!authorization) {
    return res.status(401).json({
      error: 'Et ole kirjautunut sisään',
    })
  }
  next()
}

module.exports = sessionValidator

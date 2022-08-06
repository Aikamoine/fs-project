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
  if (session.validUntil < new Date()) {
    return false
  }
  return true
}

module.exports = { extractToken, tokenIsValid }

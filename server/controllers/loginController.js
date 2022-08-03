const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { SECRET, saltRounds } = require('../util/common')
const { User } = require('../models')

const login = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username,
      isActive: true,
    },
  })

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  if (!(user && hashedPassword === user.password)) {
    return res.status(401).json({
      error: 'invalid username and/or password',
    })
  }

  const approvedUser = {
    username,
    id: user.id,
  }

  const token = jwt.sign(approvedUser, SECRET)

  return res.status(200).send({ token, username })
}

module.exports = {
  login,
}

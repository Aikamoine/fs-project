const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { SECRET, saltRounds } = require('../util/common')

const { User, Session } = require('../models')

const getAll = async (req, res) => {
  const users = await User.findAll()
  res.json(users)
}

const postUser = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = {
    username,
    password: hashedPassword,
  }

  const createdUser = await User.create(user)
  return res.json({ username: createdUser.username, id: createdUser.id })
}

const login = async (req, res) => {
  const sessionLength = () => {
    const today = new Date()
    const validDays = 2
    const validDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + validDays)

    return validDate
  }

  const { username, password } = req.body
  const user = await User.findOne({
    where: {
      username,
      isActive: true,
    },
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username and/or password',
    })
  }

  const approvedUser = {
    username,
    id: user.id,
  }

  const token = jwt.sign(approvedUser, `${SECRET}`)

  await Session.create({
    userId: user.id,
    validUntil: sessionLength(),
    token,
  })

  return res.status(200).send({ token, username, id: user.id })
}

const logout = async (req, res) => {
  console.log('server logging out', req.body)
  const { id, token } = req.body
  await Session.destroy({
    where: {
      [Op.and]: [
        {
          userId: id,
        },
        { token },
      ],
    },
  })
  return res.status(200).end()
}

module.exports = {
  getAll,
  postUser,
  login,
  logout,
}

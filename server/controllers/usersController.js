const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET, saltRounds } = require('../util/common')

const { User } = require('../models')

const getAll = async (req, res) => {
  const users = await User.findAll()
  res.json(users)
}

const postUser = async (req, res) => {
  console.log('usercontroller reached')
  const { username, password } = req.body
  console.log('usercontroller', username, password)
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = {
    username,
    password: hashedPassword,
  }

  console.log('usercontroller user', user)
  const createdUser = await User.create(user)
  console.log('created user', createdUser)
  return res.json({ username: createdUser.username, id: createdUser.id })
}

const login = async (req, res) => {
  console.log('users controller, login')
  const { username, password } = req.body
  console.log(username, password)
  const user = await User.findOne({
    where: {
      username,
      isActive: true,
    },
  })
  console.log('fetcheduser', user)

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

  const token = jwt.sign(approvedUser, SECRET)
  console.log('approved', approvedUser, token)

  return res.status(200).send({ token, username })
}

module.exports = {
  getAll,
  postUser,
  login,
}

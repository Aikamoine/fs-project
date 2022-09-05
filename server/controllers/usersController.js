const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const { adminLevels } = require('@util/common')
const { SECRET, saltRounds } = require('../util/common')
const { User, Session } = require('../models')

const getAll = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('admin')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä käyttäjähallintaan',
    })
  }
  const users = await User.findAll({
    attributes: ['id', 'username', 'isActive', 'adminLevel', [sequelize.literal(false), 'edited']],
    order: ['username'],
  })
  return res.json(users)
}

const updateUser = async (req, res) => {
  if (req.decodedToken.adminLevel < adminLevels('admin')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä käyttäjähallintaan',
    })
  }

  const {
    id, username, isActive, adminLevel,
  } = req.body

  await User.update(
    {
      isActive,
      adminLevel,
    },
    {
      where: { id, username },
    },
  )

  if (!isActive) {
    await Session.destroy({
      where: { userId: id },
    })
  }

  return res.status(200).end()
}

const getUserInfo = async (req, res) => {
  if (req.decodedToken) {
    const { adminLevel, username, id } = req.decodedToken
    return res.json({ adminLevel, username, id })
  }
  return res.json({ adminLevel: 0 })
}

const postUser = async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = {
    username,
    password: hashedPassword,
    adminLevel: 1,
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
      error: 'virheellinen käyttäjätunnus ja/tai salasana',
    })
  }

  const validUntil = sessionLength()
  const approvedUser = {
    username,
    id: user.id,
    validUntil,
    adminLevel: user.adminLevel,
  }

  const token = jwt.sign(approvedUser, `${SECRET}`)

  await Session.create({
    userId: user.id,
    validUntil,
    token,
  })

  return res.status(200).send({
    token,
    username,
    id: user.id,
    adminLevel: user.adminLevel,
  })
}

const changePassword = async (req, res) => {
  console.log('changepassword', req.body)
  const { id, username } = req.decodedToken
  const { originalPassword, password } = req.body

  const user = await User.findOne({
    where: {
      username,
      id,
    },
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(originalPassword, user.password)

  if (!(user && passwordCorrect && username === req.body.username)) {
    return res.status(401).json({
      error: 'Virheellinen salasana',
    })
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds)

  await User.update(
    {
      password: hashedPassword,
    },
    {
      where: { id, username },
    },
  )

  await Session.destroy({
    where: {
      userId: id,
    },
  })

  return res.status(200).end()
}

const logout = async (req, res) => {
  const auth = req.get('authorization')
  const { id } = req.decodedToken
  const token = auth.substring(7)

  const destroyed = await Session.destroy({
    where: {
      [Op.and]: [
        {
          userId: id,
        },
        { token },
      ],
    },
  })

  return res.status(200).send({ destroyed })
}

module.exports = {
  getAll,
  postUser,
  login,
  logout,
  getUserInfo,
  updateUser,
  changePassword,
}

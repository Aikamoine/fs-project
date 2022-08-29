const { adminLevels } = require('@util/common')
const {
  Tag,
} = require('../models')

const getTags = async (req, res) => {
  const tags = await Tag.findAll({
    order: ['name'],
  })
  res.json(tags)
}

const saveTag = async (req, res) => {
  const {
    id, name, newName, countServings,
  } = req.body

  if (req.decodedToken.adminLevel < adminLevels('editor')) {
    return res.status(403).json({
      error: 'Käyttöoikeutesi ei riitä tunnisteiden lisäämiseen',
    })
  }

  try {
    if (id > 0) {
      await Tag.update(
        {
          name: newName || name,
          countServings,
        },
        {
          where: { id },
        },
      )
    } else {
      await Tag.create({
        name: newName,
        countServings,
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Lisäyksessä tapahtui virhe',
    })
  }
  return res.status(200).end()
}

const deleteTag = async (req, res) => {
  const { id } = req.params
  console.log('req', req.decodedToken)
  console.log('admin', adminLevels('admin'))
  if (req.decodedToken.adminLevel < adminLevels('admin')) {
    return res.status(401).json({
      error: 'Käyttöoikeutesi ei riitä tunnisteiden poistamiseen',
    })
  }

  Tag.destroy({
    where: { id },
  })

  return res.status(200).end()
}

module.exports = {
  getTags,
  saveTag,
  deleteTag,
}

const {
  Tag,
} = require('../models')

const getTags = async (req, res) => {
  const tags = await Tag.findAll({
    order: ['name'],
  })
  res.json(tags)
}

module.exports = {
  getTags,
}

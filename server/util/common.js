const common = require('@root/config/common')
require('dotenv').config()

const saltRounds = 10

module.exports = {
  ...common,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  saltRounds,
}

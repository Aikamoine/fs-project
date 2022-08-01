const common = require('@root/config/common')
require('dotenv').config()

module.exports = {
  ...common,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
}

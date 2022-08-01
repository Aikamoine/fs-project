const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./common')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'server/migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('database connected')
  } catch (error) {
    console.log('connecting database failed')
    console.log(error)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }

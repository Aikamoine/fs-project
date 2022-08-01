const express = require('express')
const errorMiddleware = require('@middleware/errorMiddleware')

const routes = require('@util/routes')

const app = express()
app.use(express.json())

app.use(routes)

app.use(errorMiddleware)

module.exports = app

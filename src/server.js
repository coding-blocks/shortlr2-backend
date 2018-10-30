const express = require('express')

const routes = {
  api: require('./routes/api'),
  auth: require('./routes/auth')
}

const server = express()

// Body parsers
server.use(express.json())
server.use(express.urlencoded({extended: true}))

// Routes
server.use('/api', routes.api)
server.use('/auth', routes.auth)



module.exports = {
  server
}
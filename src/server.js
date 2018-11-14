const express = require('express')
const session = require('express-session')
const passport = require('./auth/passport')
const config = require('../config')

const routes = {
  api: require('./routes/api'),
  auth: require('./routes/auth'),
  login: require('./routes/login'),
  shorten: require('./routes/shorten')
}

const server = express()

server.use(session({
  secret: config.SESSION.SECRET
}))

// Body parsers
server.use(express.json())
server.use(express.urlencoded({extended: true}))

// Auth
server.use(passport.initialize())
server.use(passport.session())

// Routes
server.use('/api', routes.api)
server.use('/auth', routes.auth)
server.use('/login', routes.login)
server.use('/shorten', routes.shorten)

module.exports = {
  server
}
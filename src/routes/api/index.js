const { Router } = require('express')

const shortener = require('./shorten')

const route = Router()

route.use('/', shortener)

module.exports = route
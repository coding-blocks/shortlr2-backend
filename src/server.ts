import express from 'express'
import flash from 'express-flash'
import hbs from 'express-hbs'
import session from 'express-session'
import path from 'path'
import Raven from 'raven'
import config = require('../config.js')

import { passport } from './passport/setup'
import { route as apiRoute } from './routes/api'
import { route as pagesRoute } from './routes/pages'
import { dec, ifcontains, ifeq, inc } from './utils/handlebar-helpers'

const app = express()

// Setup Raven ------------ start -------------
Raven.config(config.RAVEN.DSN).install()
app.use(Raven.requestHandler())
// Setup Raven ------------ end -------------

// Setup HBS engine -------- start -------
app.engine(
  'hbs',
  hbs.express4({
    partialsDir: path.join(__dirname, '../views/partials'),
    layoutsDir: path.join(__dirname, '../views/layouts'),
    defaultLayout: path.join(__dirname, '../views/layouts/main.hbs'),
  }),
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../views'))
hbs.registerHelper('ifeq', ifeq)
hbs.registerHelper('ifcontains', ifcontains)
hbs.registerHelper('inc', inc)
hbs.registerHelper('dec', dec)
// Setup HBS engine -------- end -------

// Setup Body parsers -------- start -------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Setup Body parsers -------- end -------

// Setup Session and Passport ---------- start -----------
app.use(
  session({
    secret: config.SESSION.SECRET,
  }),
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
// Setup Session and Passport ---------- end -----------

app.use('/api', apiRoute)
app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/', pagesRoute)

app.use(Raven.errorHandler())

export { app }

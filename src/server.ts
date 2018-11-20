import express from 'express'
import flash from 'express-flash'
import hbs from 'express-hbs'
import session from 'express-session'
import path from 'path'
import config = require('../config.js')

import { passport } from './passport/setup'
import { route as apiRoute } from './routes/api'
import { route as pagesRoute } from './routes/pages'

const app = express()

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
// Setup HBS engine -------- end -------

// Setup HBS engine -------- start -------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Setup HBS engine -------- end -------

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
app.use('/', pagesRoute)
app.use('/', express.static(path.join(__dirname, '../public')))

export { app }

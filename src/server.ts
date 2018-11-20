import express from 'express'
import hbs from 'express-hbs'
import path from 'path'

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

app.use('/api', apiRoute)
app.use('/', pagesRoute)

export { app }

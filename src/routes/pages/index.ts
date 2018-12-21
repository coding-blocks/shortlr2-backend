import { Router } from 'express'
import { route as authRoute } from './auth'
import { route as expandRoute } from './expand'
import { route as urlsRoute } from './urls'

export const route = Router()

route.use('/admin', (req, res) => {
  res.redirect('/')
})

route.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user
    res.locals.loggedIn = true
  }
  next()
})

route.use('/urls', urlsRoute)
route.use(authRoute)
route.use(expandRoute)

route.get('/', (req, res) => {
  let showBomb = true
  if (req.user) {
    showBomb = false
  }
  res.render('pages/index', { showBomb })
})

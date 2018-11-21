import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

route.get('/', (req, res) => {
  return res.render('pages/urls/index')
})

route.get('/new', (req, res) => {
  return res.render('pages/urls/new')
})

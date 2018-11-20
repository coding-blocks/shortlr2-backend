import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

route.get('/', (req, res) => {
  if (req.user) {
    return res.render('pages/urls/index')
  }
})

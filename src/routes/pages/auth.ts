import { Router } from 'express'
import passport from 'passport'

export const route = Router()

route.get('/login', passport.authenticate('oneauth'))
route.get(
  '/login/callback',
  passport.authenticate('oneauth', {
    failureRedirect: '/admin',
    failureFlash: 'Error Logging In',
    successReturnToOrRedirect: '/admin',
  }),
)

route.get('/logout', (req, res, next) => {
  req.logOut()
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/')
    })
  } else {
    res.redirect('/')
  }
})

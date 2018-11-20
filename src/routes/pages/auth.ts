import { Router } from 'express'
import passport from 'passport'

export const route = Router()

route.get(
  '/login',
  passport.authenticate('oneauth', {
    failureRedirect: '/404',
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

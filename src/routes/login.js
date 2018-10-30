const { Router } = require('express')
const passport = require('../auth/passport')

const route = Router()

/**
 * The /login route is used when user views over a browser
 * This does a session/cookie based login
 *
 * On both failure and success, redirect to root path '/'
 */

route.get('/', passport.authenticate('oneauth'))

route.get('/callback',
  passport.authenticate('oneauth', {
    failureRedirect: '/',
    failureFlash: true,
    successRedirect: '/',
    successFlash: true
  })
)

module.exports = route
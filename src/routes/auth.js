const { Router } = require('express')
const passport = require('../auth/passport')
const AuthToken = require('../db/index').AuthToken

const route = Router()

/**
 * The /auth route is used when user logs in via a client app
 * This does a Bearer token based login
 *
 * On both failure and success, provide JSON response body
 * Status codes should be 401 and 200 respectively
 *
 * On success response body should contain the login token
 */

route.get('/', passport.authenticate('oneauth'))

route.get('/callback',
  passport.authenticate('oneauth'),
  async (req, res) => {
    // TODO: Create token connected to req.user, and send token in response here
    console.log('req_user: ' + req.user)
    res.send(200)
  }
)

module.exports = route
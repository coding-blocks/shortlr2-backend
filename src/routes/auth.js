const { Router } = require('express')
const passport = require('../auth/passport')

const route = Router()

route.get('/', passport.authenticate('oneauth'))

route.get('/callback',
  passport.authenticate('oneauth'),
  async (req, res) => {
    // TODO: Create token connected to req.user, and send token in response here
  }
)

module.exports = route
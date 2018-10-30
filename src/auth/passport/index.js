const passport = require('passport')
const strategies = require('./strategies')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  // TODO: Retrieve user from userId
})

passport.use(strategies.bearer)
passport.use(strategies.oneauth)

module.exports = passport
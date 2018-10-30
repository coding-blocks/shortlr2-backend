const passport = require('passport')
const strategies = require('./strategies')

passport.serializeUser((user, done) => {

})

passport.deserializeUser((userId, done) => {

})

passport.use(strategies.bearer)
passport.use(strategies.oneauth)
const passport = require('passport')
const strategies = require('./strategies')
const User = require('../../db/index').User

passport.serializeUser((user, done) => {
  console.log('my_user', user)
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  // TODO: Retrieve user from userId
  console.log('userid_deserializeUser', userId);
  User.findOne ({
  	where: {id: userId}
  }).then(user => {
  	if (!user) {
  		done (new Error('User does not exist'))
  	}
  	done (null, user)
  }).catch(err => {
  	done (err)
  })
})

passport.use(strategies.bearer)
passport.use(strategies.oneauth)

module.exports = passport
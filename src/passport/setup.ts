import passport from 'passport'
import { findUserById } from '../controllers/users'
import { UserAttributes } from '../db/models'

passport.serializeUser((user: UserAttributes, done) => {
  return done(null, user.id)
})

passport.deserializeUser((userId: number, done) => {
  findUserById(userId)
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      // TODO: Raven
      done(err)
    })
})

export { passport }

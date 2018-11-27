import debug from 'debug'
import passport from 'passport'
import { OneauthProfile, Strategy as OneauthStrategy } from 'passport-oneauth'
import * as path from 'path'
import Raven from 'raven'
import config = require('../../config.js')
import { findCreateFindUser, findUserById } from '../controllers/users'
import { UserAttributes, UserRole } from '../db'

const log = debug('shortlr:auth:oneauth')

passport.serializeUser((user: UserAttributes, done) => {
  return done(null, user.id)
})

passport.deserializeUser((userId: number, done) => {
  findUserById(userId)
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      Raven.captureException(err)
      done(err)
    })
})

passport.use(
  new OneauthStrategy(
    {
      authorizationURL: 'https://account.codingblocks.com/oauth/authorize',
      tokenURL: 'https://account.codingblocks.com/oauth/token',
      clientID: config.ONEAUTH.CLIENT_ID,
      clientSecret: config.ONEAUTH.CLIENT_SECRET,
      // callbackURL: path.join(config.SERVER.URL, config.ONEAUTH.CALLBACK_URL),
      callbackURL: config.ONEAUTH.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: OneauthProfile, done) => {
      try {
        const user = await findCreateFindUser({
          id: Number(profile.id),
          username: profile.username,
          role: (profile.role || 'user') as UserRole,
          name: profile.name,
        })
        return done(null, user)
      } catch (e) {
        Raven.captureException(e)
        done(e)
      }
    },
  ),
)

export { passport }

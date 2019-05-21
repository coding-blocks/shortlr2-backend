import debug from 'debug'
import passport from 'passport'
import AuthTokenStrategy from 'passport-auth-token'
import { OneauthProfile, Strategy as OneauthStrategy } from 'passport-oneauth'
import Raven from 'raven'
import config = require('../../config.js')
import { findCreateFindUser, findUserById } from '../controllers/users'
import { AuthTokens, UserAttributes, UserRole, Users } from '../db'

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
  'authtoken',
  new AuthTokenStrategy(async (token, done) => {
    try {
      const authToken = await AuthTokens.findOne({
        where: {
          token,
        },
      })
      if (authToken) {
        const user = await Users.findById(authToken.userId)
        return done(null, user)
      }
      done(null, false)
    } catch (err) {
      Raven.captureException(err)
      done(err)
    }
  }),
)

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
        const opts = {
          id: Number(profile.id),
          username: profile.username,
          role: (profile.role || 'user') as UserRole,
          email: profile.verifiedemail,
          name: profile.name,
        }
        const user = await findCreateFindUser(opts)
        await user.update({
          ...opts,
          role: user.role || 'user',
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

import { Router } from 'express'
import passport from 'passport'
import { route as urlsApiRoute } from './url'

export const route = Router()

route.use(
  passport.authenticate('authtoken', {
    session: false,
  }),
)

route.use('/urls', urlsApiRoute)

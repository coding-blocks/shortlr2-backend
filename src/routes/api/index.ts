import { Router } from 'express'
import passport from 'passport'

export const route = Router()

route.use(
  passport.authenticate('authtoken', {
    session: false,
  })
)

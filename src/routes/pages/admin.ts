import { Router } from 'express'
import passport from 'passport'

export const route = Router()

route.get('/', (req, res) => {
  if (req.user) {
    return res.render('pages/admin/loggedin')
  } else {
    return res.render('pages/admin/loggedout')
  }
})

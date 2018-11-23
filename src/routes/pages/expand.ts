import { Router } from 'express'
import { findByShortcode } from '../../controllers/urls'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findByShortcode(req.params.code)
    return res.redirect(url.longUrl)
  } catch (e) {
    // TODO: Raven
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.get('/:group/:code', (req, res) => {
  // TODO: redirect to the code expansion
})

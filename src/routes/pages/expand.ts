import { Router } from 'express'
import { findByShortcode } from '../../controllers/urls'
import { URLs } from '../../db'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findByShortcode(req.params.code)
    // TODO: verify when to increment hits
    // @ts-ignore
    URLs.increment('hits', {
      where: {
        code: url.code
      }
    })
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

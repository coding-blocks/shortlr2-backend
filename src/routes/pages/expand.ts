import { Router } from 'express'
import { findByShortcode, updateUrl, URLUpdateOptions } from '../../controllers/urls'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findByShortcode(req.params.code)
    // TODO: verify when to increment hits
    const updatedUrl: URLUpdateOptions = {
      code: url.code,
      hits: url.hits+1
    }
    await updateUrl(updatedUrl)
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

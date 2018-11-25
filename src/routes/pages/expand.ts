import { Router } from 'express'
import { findGroupByPrefix } from '../../controllers/groups'
import { findUrlByCodeInt, findUrlByShortcode } from '../../controllers/urls'
import { urlOptsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.code)
    return res.redirect(url.longUrl)
  } catch (e) {
    // TODO: Raven
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.get('/:group/:code', async (req, res) => {
  try {
    const group = await findGroupByPrefix(req.params.group)
    if (!group) {
      throw new Error('URL Group prefix not found. Wrong URL possibly.')
    }
    const urlOpts = urlOptsFromGroupedShortcode(group, req.params.code)
    const url = await findUrlByCodeInt(urlOpts.codeInt)
    if (!url) {
      throw new Error('Shortcode not found')
    }
    res.redirect(url.longUrl)
  } catch (e) {
    // TODO: Raven
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

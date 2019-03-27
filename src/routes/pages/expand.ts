import { Router } from 'express'
import Raven from 'raven'
import { createEvent } from '../../controllers/events'
import { findGroupByPrefix } from '../../controllers/groups'
import { findUrlByCodeInt, findUrlByShortcode } from '../../controllers/urls'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.code)
    if (url.private) {
      if (!req.isAuthenticated()) {
        ;(req.session as any).returnTo = url.longUrl
        return res.render('pages/urls/private')
      }
    }
    res.redirect(url.longUrl)
    // Redirect first, then handle hit increment later
    createEvent(url, req, req.user)
    url.increment('hits').catch(err => {
      Raven.captureException(err)
    })
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/')
  }
})

route.get('/:group/:code', async (req, res) => {
  try {
    const group = await findGroupByPrefix(req.params.group)
    if (!group) {
      throw new Error('URL Group prefix not found. Wrong URL possibly.')
    }
    const opts = optsFromGroupedShortcode(group, req.params.code)
    const url = await findUrlByCodeInt(opts.codeInt)
    if (!url) {
      throw new Error('Shortcode not found')
    }
    if (url.private) {
      if (!req.isAuthenticated()) {
        ;(req.session as any).returnTo = url.longUrl
        return res.render('pages/urls/private')
      }
    }
    res.redirect(url.longUrl)
    createEvent(url, req, req.user)
    url.increment('hits').catch(err => {
      Raven.captureException(err)
    })
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/')
  }
})

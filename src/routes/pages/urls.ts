import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import Raven from 'raven'
import { findGroupByPrefix } from '../../controllers/groups'
import querystring from 'querystring'
import {
  createUrl,
  findUrlByCodeInt,
  findUrlByShortcode,
  getAllUrlsForUser,
  PageOptions,
  PaginationOptions,
  updateUrl,
  URLOptions,
} from '../../controllers/urls'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

export interface CampaignOptions {
  utm_source?: string
  utm_medium?: string
  utm_name?: string
}

// Pagination middleware
route.use((req, res, next) => {
  const LIMIT = 20
  if (!req.query.page || req.query.page < 0) {
    req.query.page = 1
  }
  req.query.limit = LIMIT
  next()
})

route.get('/', async (req, res) => {
  const page: PageOptions = {
    offset: req.query.limit * (req.query.page - 1),
    limit: req.query.limit,
  }
  const { urls, pagination } = await getAllUrlsForUser(req.user, page)
  const pageList = Array.from({ length: pagination.pageCount }, (v, k) => k + 1)
  return res.render('pages/urls/index', { urls, pagination, pageList })
})

route.get('/new', (req, res) => {
  return res.render('pages/urls/new')
})

route.get('/:url', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.url)
    const editable = req.user.role === 'admin' || req.user.id === url.ownerId
    return res.render('pages/urls/url', { url, editable })
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.post('/:url', async (req, res) => {
  try {
    const newUrl: URLOptions = {
      longUrl: req.body.longUrl,
      private: req.body.private,
    }
    const urlOpts = await updateUrl(req.params.url, newUrl, req.user)
    res.redirect(`/urls/${urlOpts.codeActual}`)
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.get('/:group/:url', async (req, res) => {
  try {
    const group = await findGroupByPrefix(req.params.group)
    if (!group) {
      throw new Error('Group prefix does not exist')
    }
    const opts = optsFromGroupedShortcode(group, req.params.url)
    const url = await findUrlByCodeInt(opts.codeInt)
    if (!url) {
      throw new Error('Shortcode does not exist')
    }
    const editable = req.user.role === 'admin' || req.user.id === url.ownerId
    return res.render('pages/urls/url', { url, editable })
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.post('/:group/:url', async (req, res) => {
  try {
    const newUrl: URLOptions = {
      longUrl: req.body.longUrl,
      private: req.body.private,
    }
    const group = await findGroupByPrefix(req.params.group)
    if (!group) {
      throw new Error('Group prefic foes not exist')
    }
    const urlOpts = await updateUrl(req.params.url, newUrl, req.user, group)
    res.redirect(`/urls/${urlOpts.codeActual}`)
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.post('/', async (req, res) => {
  try {
    const campaignOpts: CampaignOptions = {
      utm_source: req.body.utm_source,
      utm_medium: req.body.utm_medium,
      utm_name: req.body.utm_name
    }
    // remove null keys
    Object.keys(campaignOpts).forEach((k) => {
      if (!campaignOpts[k]) { 
        delete campaignOpts[k]
      }
    })
    const [longUrl, query] = req.body.longUrl.split('?')
    const actualQuery = (query ? `${query}&` : '') + querystring.stringify(campaignOpts)
    const urlOpts: URLOptions = {
      longUrl: `${longUrl}?${actualQuery}`,
      shortCode: req.body.shortCode,
      private: req.body.private,
    }
    const url = await createUrl(
      urlOpts,
      req.user,
    )
    if (!url) {
      throw new Error('Error creating shortlink. Try again')
    }
    res.redirect(`/urls/${url.codeActual}`)
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls/new')
  }
})

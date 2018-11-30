import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import Raven from 'raven'
import { findGroupByPrefix } from '../../controllers/groups'
import {
  createUrl,
  findUrlByCodeInt,
  findUrlByShortcode,
  getAllUrlsForUser,
  PageOptions,
  PaginationOptions,
} from '../../controllers/urls'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

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
  const pageList = Array.from({length: pagination.pageCount}, (v, k) => k+1);
  return res.render('pages/urls/index', { urls, pagination, pageList })
})

route.get('/new', (req, res) => {
  return res.render('pages/urls/new')
})

route.get('/:url', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.url)
    return res.render('pages/urls/url', { url })
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
    if (!group) {
      throw new Error('Shortcode does not exist')
    }
    return res.render('pages/urls/url', { url })
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.post('/', async (req, res) => {
  try {
    const url = await createUrl(
      {
        longUrl: req.body.longUrl,
        shortCode: req.body.shortCode,
      },
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

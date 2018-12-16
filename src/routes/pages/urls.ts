import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import querystring from 'querystring'
import Raven from 'raven'
import { findGroupByPrefix } from '../../controllers/groups'
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
import paginationMiddleware from '../../middlewares/pagination'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

// Pagination middleware
route.use(paginationMiddleware)

route.get('/', async (req, res) => {
  const page: PageOptions = {
    offset: res.locals.pagination.limit * (res.locals.pagination.page - 1),
    limit: res.locals.pagination.limit,
  }
  let getAll: boolean = false
  if (req.query.all && req.query.all === 'true') {
    req.query.all = true
    getAll = true
  }
  const { urls, pagination } = await getAllUrlsForUser(req.user, page, getAll)
  if (pagination.hasNext) {
    pagination.nextUrl =
      '?' + querystring.stringify({ ...req.query, page: pagination.page + 1 })
  }
  if (pagination.hasPrev) {
    pagination.prevUrl =
      '?' + querystring.stringify({ ...req.query, page: pagination.page - 1 })
  }
  const pageList: string[] = Array.from(
    { length: pagination.pageCount },
    (v, k) => k + 1,
  ).map(o => {
    return '?' + querystring.stringify({ ...req.query, page: o })
  })
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
    const url = await createUrl(
      {
        longUrl: req.body.longUrl,
        shortCode: req.body.shortCode,
        private: req.body.private,
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

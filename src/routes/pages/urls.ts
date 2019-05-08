import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import querystring from 'querystring'
import Raven from 'raven'
import { getEventsOfUrl } from '../../controllers/events'
import { findGroupByPrefix } from '../../controllers/groups'
import {
  createUrl,
  deleteUrl,
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

// Pagination middleware
route.use((req, res, next) => {
  const LIMIT = 20
  if (!req.query.page || req.query.page < 0) {
    req.query.page = 1
  }
  res.locals.pagination = {
    page: req.query.page,
    limit: LIMIT,
  }
  next()
})

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
    const events = await getEventsOfUrl(url)
    const editable = req.user.role === 'admin' || req.user.id === url.ownerId
    return res.render('pages/urls/url', { url, events, editable })
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

route.delete('/:url', async (req, res) => {
  const deleted = await deleteUrl(req.params.url, req.user)
  res.send(deleted ? 'deleted' : 'not_authorised')
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
    const events = await getEventsOfUrl(url)
    const editable = req.user.role === 'admin' || req.user.id === url.ownerId
    return res.render('pages/urls/url', { url, events, editable })
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
      throw new Error('Group prefix does not exist')
    }
    const urlOpts = await updateUrl(req.params.url, newUrl, req.user, group)
    res.redirect(`/urls/${urlOpts.codeActual}`)
  } catch (e) {
    Raven.captureException(e)
    req.flash('error', e.message)
    res.redirect('/urls')
  }
})

route.delete('/:group/:url', async (req, res) => {
  const group = await findGroupByPrefix(req.params.group)
  if (!group) {
    throw new Error('Group prefix does not exist')
  }
  const deleted = await deleteUrl(req.params.url, req.user, group)
  res.send(deleted ? 'deleted' : 'not_authorised')
})

route.post('/', async (req, res) => {
  try {
    if (!req.user.email) {
      throw new Error(
        'Email address not verified. If already verified try logging in again!',
      )
    }
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

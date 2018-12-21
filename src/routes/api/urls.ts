import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import querystring from 'querystring'
import Raven from 'raven'
import { findGroupById, findGroupByPrefix } from '../../controllers/groups'
import {
  createUrl,
  findUrlByCodeInt,
  findUrlByShortcode,
  getAllUrlsForUser,
  PageOptions,
  updateUrl,
  URLOptions,
} from '../../controllers/urls'
import paginationMiddleware from '../../middlewares/pagination'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

// APIs only for logged in peeps !
route.use(ensureLoggedIn('/login'))

// Pagination Middleware
route.use(paginationMiddleware)

// All are json responses
route.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
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
  const urlsAndPagination = await getAllUrlsForUser(req.user, page, getAll)
  if (urlsAndPagination.pagination.hasNext) {
    urlsAndPagination.pagination.nextUrl =
      '?' +
      querystring.stringify({
        ...req.query,
        page: urlsAndPagination.pagination.page + 1,
      })
  }
  if (urlsAndPagination.pagination.hasPrev) {
    urlsAndPagination.pagination.prevUrl =
      '?' +
      querystring.stringify({
        ...req.query,
        page: urlsAndPagination.pagination.page - 1,
      })
  }

  res.send(JSON.stringify(urlsAndPagination))
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

    res.send(url)
  } catch (e) {
    Raven.captureException(e)
    res.send(e)
  }
})

route.get('/:url', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.url)

    res.send(JSON.stringify(url))
  } catch (e) {
    Raven.captureException(e)
    res.send(e)
  }
})

route.post('/:url', async (req, res) => {
  try {
    const newUrl: URLOptions = {
      longUrl: req.body.longUrl,
      private: req.body.private,
    }
    const urlOpts = await updateUrl(req.params.url, newUrl, req.user)
    res.send(JSON.stringify(urlOpts))
  } catch (e) {
    Raven.captureException(e)
    res.send(e)
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

    res.send(JSON.stringify(url))
  } catch (e) {
    Raven.captureException(e)
    res.send(e)
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
      throw new Error('Group prefic does not exist')
    }
    const urlOpts = await updateUrl(req.params.url, newUrl, req.user, group)

    res.send(JSON.stringify(urlOpts))
  } catch (e) {
    Raven.captureException(e)
    res.send(e)
  }
})

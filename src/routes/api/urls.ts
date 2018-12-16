import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import querystring from 'querystring'
import { getAllUrlsForUser, PageOptions } from '../../controllers/urls'
import paginationMiddleware from '../../middlewares/pagination'

export const route = Router()

// APIs only for logged in peeps !
route.use(ensureLoggedIn('/login'))

// Pagination Middleware
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

  res.header('Content-Type', 'application/json')
  res.send(JSON.stringify(urlsAndPagination))
})

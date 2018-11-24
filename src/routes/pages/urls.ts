import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import { createUrl, findByShortcode, getAllUrlsForUser, LimitingOptions} from '../../controllers/urls'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

// Pagination middleware
route.use((req, res, next) => {
  const LIMIT = 20
  if (req.query.page <= 0) req.query.page = 1
  req.query.limit = LIMIT
  next()
})

route.get('/', async (req, res) => {
  const limit: LimitingOptions = {
    offset: req.query.limit * (req.query.page - 1),
    limit:  req.query.limit
  }
  const [urls, pagination] = await getAllUrlsForUser(req.user, limit)
  return res.render('pages/urls/index', { urls, pagination })
})

route.get('/new', (req, res) => {
  return res.render('pages/urls/new')
})

route.get('/:url', async (req, res) => {
  try {
    const url = await findByShortcode(req.params.url)
    return res.render('pages/urls/url', { url })
  } catch (e) {
    // TODO: Raven
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
    // TODO: Raven
    req.flash('error', e.message)
    res.redirect('/urls/new')
  }
})

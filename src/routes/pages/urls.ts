import { ensureLoggedIn } from 'connect-ensure-login'
import { Router } from 'express'
import passport from 'passport'
import {
  createUrl,
  findByShortcode,
  getAllUrlsForUser,
} from '../../controllers/urls'

export const route = Router()

// The entire URLs area is for logged in people only
route.use(ensureLoggedIn('/login'))

route.get('/', async (req, res) => {
  const urls = await getAllUrlsForUser(req.user)
  return res.render('pages/urls/index', { urls })
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

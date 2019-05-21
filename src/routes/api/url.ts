import { Router } from 'express'
import Raven from 'raven'
import { findGroupByPrefix, findUrlsInGroup } from '../../controllers/groups'
import { optsFromGroupedShortcode } from '../../utils/shortener'

import {
  createUrl,
  findUrlByCodeInt,
  findUrlByShortcode,
} from '../../controllers/urls'

export const route = Router()

route.get('/:code', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.code)

    res.json(url)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
  }
})

route.get('/:group', async (req, res) => {
  try {
    const urls = await findUrlsInGroup(req.params.group)

    res.json(urls)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
  }
})

route.get('/:group/:code', async (req, res) => {
  try {
    const group = await findGroupByPrefix(req.params.group)
    if (!group) {
      throw new Error('URL Group prefix not found, wrong URL probably!')
    }
    const opts = optsFromGroupedShortcode(group, req.params.code)
    const url = await findUrlByCodeInt(opts.codeInt)

    res.json(url)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
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
      throw new Error('Error creating shortlink, try again!')
    }
  } catch (err) {
    Raven.captureException(err)
    res.status(500).json({
      error: err.message,
    })
  }
})

import Raven from 'raven'
import { EventAttributes, Events } from '../db/models/Events'
import { URLAttributes } from '../db/models/URLs'
import { UserAttributes } from '../db/models/Users'

export const createEvent = async (
  url: URLAttributes,
  req,
  user: UserAttributes | undefined,
) => {
  try {
    if (!/([A-Za-z0-9])\w{1,5}/.test(req.query.referer)) {
      delete req.query.referer
    }
    const event = Events.create({
      code: url.code,
      fromIP: req.clientIp,
      fromURL: req.query.referer || null,
      userId: user ? user.id : undefined,
    })
    return event
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

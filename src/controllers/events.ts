import Raven from 'raven'
import { EventAttributes, Events, URLAttributes, UserAttributes } from '../db'

export const createEvent = async (
  url: URLAttributes,
  req,
  user: UserAttributes | undefined,
) => {
  try {
    const event = Events.create({
      code: url.code,
      fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      fromURL: req.query.referer || null,
      userId: user ? user.id : undefined,
    })
    return event
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

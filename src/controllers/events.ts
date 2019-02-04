import Raven from 'raven'
import sequelize from 'sequelize'
import {
  EventAttributes,
  Events,
  URLAttributes,
  UserAttributes,
  Users,
} from '../db'

export const createEvent = async (
  url: URLAttributes,
  req,
  user: UserAttributes | undefined,
) => {
  try {
    if (!/([A-Za-z0-9])\w{1,5}/.test(req.query.referer)) {
      delete req.query.referer
    }
    const event = await Events.create({
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

export const getEventsOfUrl = async (url: URLAttributes) => {
  try {
    const events = await Events.findAll({
      where: {
        code: url.code,
      },
      group: ['userId', 'user.username', 'user.id', 'user.name'],
      include: [
        {
          model: Users,
          attributes: ['username', 'name'],
        },
      ],
      attributes: [
        [
          sequelize.fn(
            'to_char',
            sequelize.fn('max', sequelize.col('event.createdAt')),
            'HH12:MI, dd/mm/yyyy',
          ),
          'date',
        ],
        [sequelize.fn('count', 'event.id'), 'clickCount'],
      ],
    })
    return events
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

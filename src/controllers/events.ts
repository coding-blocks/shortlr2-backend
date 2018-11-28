import { Events, EventAttributes, URLAttributes, UserAttributes } from '../db'

export const createEvent = async (url: URLAttributes, req, user: UserAttributes | undefined) => {
    const event = Events.create({
        code: url.code,
        fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        fromURL: req.query.refer || null,
        userId: user ? user.id : undefined
    })
    if (!event) {
        throw new Error('Could not create event')
    }
    return event
}
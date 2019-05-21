import { Router } from 'express'
import { route as urlsApiRoute } from './url'

export const route = Router()

route.use('/urls', urlsApiRoute)

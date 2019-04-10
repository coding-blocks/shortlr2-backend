import { Router } from 'express'
import { route as urlApis } from './urls'

export const route = Router()

route.use('/urls', urlApis)

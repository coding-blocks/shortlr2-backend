import { Router } from 'express'
import { route as adminRoute } from './admin'
import { route as authRoute } from './auth'

export const route = Router()

route.use('/admin', adminRoute)
route.use(authRoute)

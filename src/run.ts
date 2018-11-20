import debug from 'debug'
import config = require('../config.js')
import { db } from './db'
import { app } from './server'

const log = debug('server:run')

db.sync({
  alter: config.DB.SYNC_ALTER,
  force: config.DB.SYNC_FORCE,
}).then(() => {
  app.listen(config.SERVER.PORT, () => {
    log(`Server started on http://localhost:${config.SERVER.PORT}`)
  })
})

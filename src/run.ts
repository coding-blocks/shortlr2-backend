import debug from 'debug'
import config = require('../config.js')
import { app } from './server'

const log = debug('server:run')

app.listen(config.SERVER.PORT, () => {
  log(`Server started on http://localhost:${config.SERVER.PORT}`)
})

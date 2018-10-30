const { server } = require('./server')
const { db } = require('./db')
const config = require('../config')

async function start () {
  try {
    await db.sync()
    server.listen(config.SERVER.PORT, () => {
      console.log(`Server running on http://localhost:${config.SERVER.PORT}`)
    })
  } catch (e) {
    console.error(e)
  }
}

start()


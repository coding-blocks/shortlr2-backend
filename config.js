const secrets = require('./secrets')
module.exports = {
  SERVER: {
    PORT: process.env.PORT || 3987,
    URL: 'http://localhost:3987' // TODO: Fix properly
  },
  DB: {
    DATABASE: secrets.DB.NAME,
    USERNAME: secrets.DB.USERNAME,
    PASSWORD: secrets.DB.PASSWORD,
    HOST: secrets.DB.HOST,
    SYNC_ALTER: process.env.DB_SYNC_ALTER || false,
    SYNC_FORCE: process.env.DB_SYNC_FORCE || false
  },
  SESSION: {
    SECRET: secrets.SESSION_SECRET
  },
  ONEAUTH: {
    CLIENT_ID: secrets.ONEAUTH_CLIENT_ID,
    CLIENT_SECRET: secrets.ONEAUTH_CLIENT_SECRET,
    CALLBACK_URL: '/login/callback'
  },
  RAVEN: {
    DSN: secrets.SENTRY_DSN
  }
}

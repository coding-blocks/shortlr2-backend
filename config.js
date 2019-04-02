const secrets = require('./secrets')
let SERVER_URL = (process.env.NODE_ENV === 'production') ? 'https://cb.lk' : 'http://localhost:3987'
if (process.env.SHORTLR_URL) {
  SERVER_URL = process.env.SHORTLR_URL
}

const config = {
  SERVER: {
    PORT: process.env.PORT || 3987,
    URL: SERVER_URL
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
    SECRET: secrets.SESSION_SECRET,
    DROP_SESSION: process.env.DROP_SESSION || false
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

config.COOKIE_DOMAIN = (process.env.NODE_ENV === 'production') ? 'cb.lk' : null

module.exports = config

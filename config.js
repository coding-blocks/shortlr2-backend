const secrets = require('./secrets')
module.exports = {
  SERVER: {
    PORT: process.env.PORT || 3987,
    URL: 'http://localhost:3987' // TODO: Fix properly
  },
  DB: {
    DATABASE: 'shortlr2',
    USERNAME: 'shortlr2',
    PASSWORD: 'shortlr2',
    SYNC_ALTER: process.env.DB_SYNC_ALTER || false,
    SYNC_FORCE: process.env.DB_SYNC_FORCE || false
  },
  SESSION: {
    SECRET: 'a very long session secret that you must not reveal'
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

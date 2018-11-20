module.exports = {
  SERVER: {
    PORT: process.env.PORT || 3987
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
  }
}

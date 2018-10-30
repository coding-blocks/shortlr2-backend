module.exports = {
  SERVER: {
    PORT: process.env.PORT || 8787
  },
  SESSION: {
    SECRET: 'some really really secret and long string for entropy'
  }
}
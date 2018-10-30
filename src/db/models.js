const { db } = require('./config')

const User = db.define('user', {

})
const AuthToken = db.define('auth_token', {

})

const URL = db.define('url', {

})

const Event = db.define('event', {

})

const URLGroup = db.define('url_group', {

})

module.exports = {
  User,
  AuthToken,
  URL,
  URLGroup,
  Event
}
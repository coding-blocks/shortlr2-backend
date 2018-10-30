const { db } = require('./config')

const User = db.define('user', {

})
const AuthToken = db.define('auth_token', {

})
AuthToken.belongsTo(User)
User.hasMany(AuthToken)

const URL = db.define('url', {

})

const Event = db.define('event', {

})

Event.belongsTo(URL)
URL.hasMany(Event)

const URLGroup = db.define('url_group', {

})

module.exports = {
  User,
  AuthToken,
  URL,
  URLGroup,
  Event
}
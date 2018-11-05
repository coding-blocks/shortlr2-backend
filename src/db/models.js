const Sequelize = require('sequelize')
const { db } = require('./config')

const User = db.define('user', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	}, 
	role: Sequelize.STRING
})
const AuthToken = db.define('auth_token', {
	token: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	userId: Sequelize.BIGINT
})
AuthToken.belongsTo(User)
User.hasMany(AuthToken)

const URL = db.define('url', {
	code: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	codeStr: Sequelize.STRING,
	codeActual: Sequelize.STRING,
	longUrl: Sequelize.STRING,
	hits: Sequelize.INTEGER,
	private: Sequelize.BOOLEAN
})

const Event = db.define('event', {
	id: {
		type: Sequelize.BIGINT, 
		primaryKey: true
	},
	code: Sequelize.INTEGER,
	fromIP: Sequelize.STRING,
	fromURL: Sequelize.STRING,
	userId: Sequelize.BIGINT
})

Event.belongsTo(URL)
URL.hasMany(Event)

const URLGroup = db.define('url_group', {
	id: {
		type: Sequelize.BIGINT, 
		primaryKey: true
	},
	prefix: Sequelize.STRING,
	ownerId: Sequelize.BIGINT
})

module.exports = {
  User,
  AuthToken,
  URL,
  URLGroup,
  Event
}
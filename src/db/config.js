const Sequelize = require('sequelize')

const db = new Sequelize({
  username: '',
  database: '',
  password: '',
  host: '',
  port: 0,
  pool: {

  }
})

module.exports = {
  db
}
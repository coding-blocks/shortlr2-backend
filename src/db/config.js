const Sequelize = require('sequelize')

const db = new Sequelize({
  username: 'shortlr2',
  database: 'shortlr2',
  password: 'shortlr2',
  host: 'localhost',
  dialect: 'postgres',
  pool: {

  }
})

module.exports = {
  db
}
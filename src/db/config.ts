import Sequelize from 'sequelize'
import config = require('../../config.js')

export const db = new Sequelize({
  database: config.DB.DATABASE,
  password: config.DB.PASSWORD,
  username: config.DB.USERNAME,
  host: config.DB.HOST,
  dialect: 'postgres',
})

const Sequelize = require('sequelize')

module.exports = {
  up(query, DataTypes) {
    return query.addColumn('users', 'email', {
      type: Sequelize.STRING,
      unique: true,
    })
  },
  down(query, DataTypes) {
  }
}
    
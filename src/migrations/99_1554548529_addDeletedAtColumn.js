const Sequelize = require('sequelize')

module.exports = {
  up(query, DataTypes) {
    return Promise.all([
      query.addColumn('urls', 'deletedAt', {
        type: Sequelize.DATE
      }),
      query.addColumn('groups', 'deletedAt', {
        type: Sequelize.DATE
      }),
    ])
  },
  down(query, DataTypes) {
    return Promise.all([
      query.deleteColumn('urls', 'deletedAt'),
      query.deleteColumn('groups', 'deletedAt'),
    ])
  }
}
    
module.exports = {
  up(query, Sequelize) {
    return Promise.all([
      query.sequelize.query('ALTER TABLE urls DROP CONSTRAINT "urls_codeStr_key";'),
      query.addIndex(
        'urls',
        ['codeStr', 'deletedAt'],
        {
          name: 'codeStr_deletedAt',
          where: {
            deletedAt: null
          }
        }
      )
    ]) 
  },
  down(query, Sequelize) {
    return query.removeIndex('urls', 'codeStr_deletedAt')
  }
}
    
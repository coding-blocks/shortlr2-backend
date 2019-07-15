module.exports = {
  async up(query, Sequelize) {
    await query.sequelize.query('ALTER TABLE events DROP CONSTRAINT events_code_fkey;')
    await query.sequelize.query('ALTER TABLE urls DROP CONSTRAINT urls_pkey;')
    await query.changeColumn('urls', 'code', {
      type: Sequelize.BIGINT,
    })
    await query.addColumn('urls', 'id', {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    })
    await query.addConstraint('urls', ['id'], {
      type: 'primary key',
      name: 'urls_pkey'
    });
    await query.removeIndex('urls', 'codeStr_deletedAt')
    await query.addIndex(
      'urls',
      ['code', 'codeStr', 'deletedAt'],
      {
        name: 'code_codeStr_deletedAt',
        where: {
          deletedAt: null
        }
      }
    )
    await query.addColumn('events', 'urlId', {
      type: Sequelize.BIGINT,
      references: {
        model: 'urls',
        key: 'id'
      }
    })
  },
  down(query, Sequelize) {
    // there is no coming back
  }
}
    
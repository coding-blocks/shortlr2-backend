import Sequelize from 'sequelize'

export const up = (query, DataTypes) => {
  return query.addColumn('users', 'email', {
    type: Sequelize.STRING,
    unique: true,
  })
}
export const down = (query, DataTypes) => {}

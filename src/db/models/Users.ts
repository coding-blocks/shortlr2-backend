import Sequelize from 'sequelize'
import { defineModel } from '../../utils/model-helper'
import { db } from '../config'

export type UserRole = 'admin' | 'employee' | 'intern' | 'user'

export interface UserAttributes {
  id: number
  username: string
  name?: string
  role: UserRole
}

export const Users = defineModel<UserAttributes>(db, 'user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  role: Sequelize.ENUM(['admin', 'employee', 'intern', 'user']),
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  name: Sequelize.STRING,
})

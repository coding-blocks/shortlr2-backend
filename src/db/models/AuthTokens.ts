import Sequelize from 'sequelize'
import { defineModel } from '../../utils/model-helper'
import { db } from '../config'

export interface AuthTokenAttributes {
  token: string
  userId: number
}

export const AuthTokens = defineModel<AuthTokenAttributes>(db, 'authToken', {
  token: {
    type: Sequelize.STRING(64),
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
})

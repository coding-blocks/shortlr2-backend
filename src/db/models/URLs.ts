import Sequelize, { DefineModelAttributes, Model } from 'sequelize'
import { defineModel } from '../../utils/model-helper'
import { db } from '../config'

export interface URLAttributes {
  code: number
  codeStr: string
  codeActual: string
  longUrl: string
  hits: number
  private: boolean
  ownerId?: number
  groupId?: number
}

export const URLs = defineModel<URLAttributes>(db, 'url', {
  code: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  codeStr: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  codeActual: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  longUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  hits: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  ownerId: Sequelize.INTEGER,
  groupId: Sequelize.INTEGER,
})

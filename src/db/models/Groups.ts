import Sequelize from 'sequelize'
import { defineModel } from '../../utils/model-helper'
import { db } from '../config'

export interface GroupAttributes {
  id?: number
  prefix: string
  ownerId?: number
}

export const Groups = defineModel<GroupAttributes>(
  db,
  'group',
  {
    prefix: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    ownerId: Sequelize.INTEGER,
  },
  {
    paranoid: true,
  },
)

import Sequelize, { DefineModelAttributes } from 'sequelize'
import { defineModel } from '../../utils/model-helper'
import { db } from '../config'

export interface EventAttributes {
  id?: number
  code: number
  fromIP: string
  fromURL?: string
  userId?: number
}

export const Events = defineModel<EventAttributes>(db, 'event', {
  code: Sequelize.BIGINT,
  fromIP: Sequelize.STRING,
  fromURL: Sequelize.STRING,
  userId: Sequelize.INTEGER,
} as DefineModelAttributes<EventAttributes>)

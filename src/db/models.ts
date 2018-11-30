import Sequelize, { DefineModelAttributes, Model } from 'sequelize'
import { db } from './config'

export type UserRole = 'admin' | 'employee' | 'intern' | 'user'
export interface UserAttributes {
  id: number
  username: string
  name?: string
  role: UserRole
}

function defineModel<IAttributes>(
  sequelize: Sequelize.Sequelize,
  modelName: string,
  attributes: DefineModelAttributes<IAttributes>,
): Sequelize.Model<Sequelize.Instance<IAttributes> & IAttributes, IAttributes> {
  return sequelize.define(modelName, attributes)
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

export interface URLAttributes {
  code: number
  codeStr: string
  codeActual: string
  longUrl: string
  hits: number
  private: boolean
  ownerId?: number
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
})

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

export interface GroupAttributes {
  id?: number
  prefix: string
  ownerId?: number
}

export const Groups = defineModel<GroupAttributes>(db, 'group', {
  prefix: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  ownerId: Sequelize.INTEGER,
})

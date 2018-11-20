import Sequelize, { DefineModelAttributes } from 'sequelize'
import { db } from './config'

export interface UserAttributes {
  id?: number
  role: string
}

export const Users = db.define('user', {
  role: Sequelize.STRING,
} as DefineModelAttributes<UserAttributes>)

export interface URLAttributes {
  code: number
  codeStr: string
  codeActual: string
  longUrl: string
  hits: number
  private: boolean
  ownerId?: number
}

export const URLs = db.define('url', {
  code: {
    type: Sequelize.INTEGER,
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
} as DefineModelAttributes<URLAttributes>)

export interface AuthTokenAttributes {
  token: string
  userId: number
}

export const AuthTokens = db.define('authToken', {
  token: {
    type: Sequelize.STRING(64),
    primaryKey: true,
  },
  userId: Sequelize.INTEGER,
} as DefineModelAttributes<AuthTokenAttributes>)

export interface EventAttributes {
  id?: number
  code: number
  fromIP: string
  fromURL: string
  userId?: number
}

export const Events = db.define('event', {
  code: Sequelize.INTEGER,
  fromIP: Sequelize.STRING,
  fromURL: Sequelize.STRING,
  userId: Sequelize.INTEGER,
} as DefineModelAttributes<EventAttributes>)

export interface GroupAttributes {
  id?: number
  prefix: string
  ownerId?: number
}

export const Groups = db.define('group', {
  prefix: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  ownerId: Sequelize.INTEGER,
})

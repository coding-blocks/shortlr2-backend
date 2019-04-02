import SequelizeSessionStore from 'connect-session-sequelize'
import Session from 'express-session'
import ProxyAddr from 'proxy-addr'
import RequestIp from 'request-ip'
import Sequelize, { DefineModelAttributes } from 'sequelize'

import config = require('../../config')
import { db } from '../db'
import { defineModel } from '../utils/model-helper'

// We trust local ips, first untrusted is outside this
const proxyfilter = ProxyAddr.compile(['loopback', 'linklocal', 'uniquelocal'])

interface SessionAttributes {
  sid: string
  user: string
  userId: number
  ipAddr: string
  realIp: string
  proxyPath: string[]
  expires: string
  data: string
}

defineModel<SessionAttributes>(db, 'session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  user: Sequelize.JSONB,
  userId: Sequelize.INTEGER,
  ipAddr: Sequelize.STRING(39),
  realIp: Sequelize.STRING(39),
  proxyPath: Sequelize.ARRAY(Sequelize.STRING(39)),
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000),
} as DefineModelAttributes<SessionAttributes>)

const extendDefaultFields = (defaults, session) => ({
  user: session.passport && session.passport.user,
  userId: session.passport && session.passport.user && session.passport.user.id,
  ipAddr: session.ipAddr,
  realIp: session.realIp,
  proxyPath: session.proxyPath,
  expires: defaults.expires,
  data: defaults.data,
})

const SessionStore = SequelizeSessionStore(Session.Store)

export const sessionStore = new SessionStore({
  db,
  table: 'session',
  extendDefaultFields,
})
sessionStore.sync({
  force: config.SESSION.DROP_SESSION,
})

export const saveIp = (req, res, next) => {
  if (req.session) {
    req.session.ipAddr = RequestIp.getClientIp(req)
    req.session.realIp = ProxyAddr(req, proxyfilter)
    req.session.proxyPath = ProxyAddr.all(req)
  }
  next()
}

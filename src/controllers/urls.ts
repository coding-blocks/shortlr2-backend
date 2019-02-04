import Raven from 'raven'
import sequelize = require('sequelize')
import {
  Events,
  GroupAttributes,
  Groups,
  URLAttributes,
  URLs,
  UserAttributes,
  Users,
} from '../db'
import {
  genRandomShortcode,
  optsFromGroupedShortcode,
  optsFromShortcode,
  ShortcodeOptions,
} from '../utils/shortener'
import { getEventsOfUrl } from './events'

export interface URLOptions {
  longUrl: string
  shortCode?: string
  private?: boolean
}

export interface PageOptions {
  offset?: number
  limit?: number
}

export interface PaginationOptions {
  page: number
  pageCount: number
  hasNext: boolean
  nextUrl?: string
  hasPrev: boolean
  prevUrl?: string
}

export const createUrl = async (
  urlOptions: URLOptions,
  user: UserAttributes,
) => {
  if (['admin', 'employee', 'intern'].indexOf(user.role) === -1) {
    // Custom shortcodes are not for peasants
    delete urlOptions.shortCode
  }
  if (!urlOptions.private || ['admin', 'employee'].indexOf(user.role) === -1) {
    urlOptions.private = false
  }

  let opts: ShortcodeOptions

  let groupId: number | undefined
  if (urlOptions.shortCode) {
    if (urlOptions.shortCode.indexOf('/') !== -1) {
      // We need to create a grouped short code
      const splitShortCode = urlOptions.shortCode.split('/')
      if (splitShortCode.length > 2) {
        throw new Error('Invalid shortcode syntax')
      }
      const groupCode = splitShortCode[0]

      const [group, created] = await Groups.findCreateFind({
        where: { prefix: groupCode },
        defaults: {
          prefix: groupCode,
          ownerId: user.id,
        },
      })
      opts = optsFromGroupedShortcode(group, splitShortCode[1])
      groupId = group.id
    } else {
      // We need to create custom (but not grouped) shortcode
      opts = optsFromShortcode(urlOptions.shortCode)
    }
  } else {
    // Create Random Shortcode
    opts = genRandomShortcode()
  }
  try {
    const [url, created] = await URLs.findCreateFind({
      where: {
        code: opts.codeInt,
      },
      defaults: {
        ownerId: user.id,
        code: opts.codeInt,
        codeStr: opts.codeStr,
        codeActual: opts.codeActual,
        hits: 0,
        groupId,
        longUrl: urlOptions.longUrl,
        private: urlOptions.private,
      },
    })
    if (!created) {
      throw new Error(`Shortlink already exists at: ${url.longUrl}`)
    }
    return url
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

export const updateUrl = async (
  shortCode: string,
  newUrl: URLOptions,
  user: UserAttributes,
  group: GroupAttributes | null = null,
) => {
  if (['admin', 'employee'].indexOf(user.role) === -1) {
    // Seriously? Trying to get private URLs even if not allowed
    delete newUrl.private
  }
  const opts = group
    ? optsFromGroupedShortcode(group, shortCode)
    : optsFromShortcode(shortCode)
  const [numberOfUpdates, urls] = await URLs.update(newUrl, {
    where: {
      code: opts.codeInt,
      ...(user.role === 'admin' ? {} : { ownerId: user.id }),
    },
  })
  if (numberOfUpdates === 0) {
    throw new Error('Could not find the shortcode for the current User. ')
  }
  return opts
}

export const deleteUrl = async (
  shortcode: string,
  user: UserAttributes,
  group: GroupAttributes | null = null,
) => {
  const opts = group
    ? optsFromGroupedShortcode(group, shortcode)
    : optsFromShortcode(shortcode)
  return URLs.destroy({
    where: {
      code: opts.codeInt,
      ...(user.role === 'admin' ? {} : { ownerId: user.id }),
    },
  })
}

export const findUrlByShortcode = async (shortCode: string) => {
  const opts = optsFromShortcode(shortCode)
  const url = await URLs.findOne({
    where: {
      code: opts.codeInt,
    },
  })
  if (!url) {
    throw new Error('Could not find shortcode.')
  }

  return url
}

export const findUrlByCodeInt = async (codeInt: number) => {
  const url = await URLs.findOne({
    where: {
      code: codeInt,
    },
  })
  if (!url) {
    throw new Error('Could not find URL.')
  }

  return url
}

export const getAllUrlsForUser = async (
  user: UserAttributes,
  page: PageOptions = {},
  getAll: boolean = false,
) => {
  const { offset = 0, limit = 50 } = page
  const options = {
    offset,
    limit,
    order: [['hits', 'DESC']],
    ...(user.role === 'admin' && getAll
      ? {}
      : {
          where: {
            ownerId: user.id,
          },
        }),
  }
  const { rows, count } = await URLs.findAndCountAll(options)
  const pagination: PaginationOptions = {
    page: Math.floor(offset / limit) + 1,
    pageCount: Math.ceil(count / limit),
    hasPrev: offset !== 0,
    hasNext: offset < count - limit,
  }
  return { urls: rows, pagination }
}

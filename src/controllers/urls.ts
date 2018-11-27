import Raven from 'raven'
import { Groups, URLAttributes, URLs, UserAttributes } from '../db'
import {
  genRandomShortcode,
  optsFromGroupedShortcode,
  optsFromShortcode,
  ShortcodeOptions,
} from '../utils/shortener'

export interface URLOptions {
  longUrl: string
  shortCode?: string
}

export interface PageOptions {
  offset: number
  limit: number
}

export interface PaginationOptions {
  page: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}

export const createUrl = async (
  urlOptions: URLOptions,
  user: UserAttributes,
) => {
  if (['admin', 'employee', 'intern'].indexOf(user.role) === -1) {
    // Custom shortcodes are not for peasants
    delete urlOptions.shortCode
  }
  let opts: ShortcodeOptions

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
    } else {
      // We need to create custom (but not grouped) shortcode
      opts = optsFromShortcode(urlOptions.shortCode)
    }
  } else {
    // Create Random Shortcode
    opts = genRandomShortcode()
  }
  try {
    const url = await URLs.create({
      ownerId: user.id,
      code: opts.codeInt,
      codeStr: opts.codeStr,
      codeActual: opts.codeActual,
      hits: 0,
      longUrl: urlOptions.longUrl,
      private: false, // TODO: Add support for making private links
    })
    return url
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
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
  return url!
}

export const findUrlByCodeInt = async (codeInt: number) =>
  URLs.findOne({
    where: {
      code: codeInt,
    },
  })

export const getAllUrlsForUser = async (
  user: UserAttributes,
  page: PageOptions,
) => {
  const options = {
    where: {
      ownerId: user.id,
    },
    ...page,
  }
  const { rows, count } = await URLs.findAndCountAll(options)
  const pagination: PaginationOptions = {
    page: Math.floor(page.offset / 20) + 1,
    pageCount: Math.ceil(count / 20),
    hasPrev: page.offset !== 0,
    hasNext: page.offset < count - 20,
  }
  return { urls: rows, pagination }
}

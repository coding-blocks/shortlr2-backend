import { Groups, URLAttributes, URLs, UserAttributes } from '../db'
import {
  genRandomShortcode,
  optsFromGroupedShortcode,
  optsFromShortcode,
} from '../utils/shortener'

export interface URLOptions {
  longUrl: string
  shortCode?: string
}

export const createUrl = async (
  urlOptions: URLOptions,
  user: UserAttributes,
) => {
  if (['admin', 'employee', 'intern'].indexOf(user.role) === -1) {
    // Custom shortcodes are not for peasants
    delete urlOptions.shortCode
  }

  if (urlOptions.shortCode) {
    if (urlOptions.shortCode.indexOf('/') !== -1) {
      // We need to create a grouped short code
      const splitShortCode = urlOptions.shortCode.split('/')
      if (splitShortCode.length > 2) {
        throw new Error('Invalid shortcode syntax')
      }
      const groupCode = splitShortCode[0]

      const group = await Groups.findCreateFind({
        where: { prefix: groupCode },
        defaults: {
          prefix: groupCode,
          ownerId: user.id,
        },
      })
    }
  } else {
    // Create Random Shortcode
    const opts = genRandomShortcode()
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

export const getAllUrlsForUser = async (user: UserAttributes) => {
  const urls = await URLs.findAll({
    where: {
      ownerId: user.id,
    },
  })
  return urls!
}

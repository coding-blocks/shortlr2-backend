import { Groups, URLAttributes, URLs, UserAttributes } from '../db'
import { genRandomShortcode } from '../utils/shortener'
import { expandFromShortcode } from '../utils/expander'

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
    const shortCode = genRandomShortcode()
    const url = await URLs.create({
      ownerId: user.id,
      code: shortCode.codeInt,
      codeStr: shortCode.codeStr,
      codeActual: shortCode.codeActual,
      hits: 0,
      longUrl: urlOptions.longUrl,
      private: false, // TODO: Add support for making private links
    })
    return url
  }
}

export const findByShortcode = async (shortCode: string) => {
  const urlOptions = expandFromShortcode(shortCode)
  const url = await URLs.findOne({
    where: {
      code: urlOptions.codeInt,
    },
  })
  if (!url) {
    throw new Error('Could not find shortcode.')
  }
  return url!
}

export const getAllUrlsForUser = async (user: UserAttributes) => {
  const urls = await URLs.findAll({
    where: {
      ownerId: user.id,
    },
  })
  return urls!
}

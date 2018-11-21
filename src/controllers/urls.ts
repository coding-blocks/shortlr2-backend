import { Groups, URLAttributes, URLs, UserAttributes } from '../db'

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
  }
}

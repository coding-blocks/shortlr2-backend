import { UserAttributes, Users } from '../db/models'

export const findUserById = async userId => {
  try {
    const user = await Users.findById(userId)
    if (!user) {
      throw new Error('Could not find user')
    }
    return user
  } catch (e) {
    // TODO: Raven
    throw e
  }
}

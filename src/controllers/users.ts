import Raven from 'raven'
import { UserRole, Users } from '../db/models/Users'

export const findUserById = async userId => {
  try {
    const user = await Users.findById(userId)
    if (!user) {
      throw new Error('Could not find user')
    }
    return user
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

export const findCreateFindUser = async (newUser: {
  id: number
  username: string
  name?: string
  role: UserRole
}) => {
  try {
    const [user, created] = await Users.findCreateFind({
      defaults: newUser,
      where: { id: newUser.id },
    })
    return user
  } catch (e) {
    Raven.captureException(e)
    throw e
  }
}

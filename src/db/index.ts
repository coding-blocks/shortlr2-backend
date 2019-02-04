export { db } from './config'
import { AuthTokens, Events, Groups, URLs, Users } from './models'

export {
  UserAttributes,
  GroupAttributes,
  EventAttributes,
  AuthTokenAttributes,
  URLAttributes,
  UserRole,
} from './models'

// Run associations

URLs.belongsTo(Users, { foreignKey: 'ownerId' })
Users.hasMany(URLs, { foreignKey: 'ownerId' })

URLs.belongsTo(Groups, { foreignKey: 'groupId' })
Groups.hasMany(URLs, { foreignKey: 'groupId' })

AuthTokens.belongsTo(Users)
Users.hasMany(AuthTokens)

Events.belongsTo(URLs, { foreignKey: 'code' })
URLs.hasMany(Events, { foreignKey: 'code' })

Events.belongsTo(Users)

Groups.belongsTo(Users, { foreignKey: 'ownerId' })
Users.hasMany(Groups, { foreignKey: 'ownerId' })

export { AuthTokens, Events, URLs, Users, Groups }

import { AuthTokens } from './models/AuthTokens'
import { Events } from './models/events'
import { Groups } from './models/Groups'
import { URLs } from './models/URLs'
import { Users } from './models/Users'

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

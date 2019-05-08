// tslint:disable:no-console
import { db, Events, URLs, Users } from '../src/db'

const userIds = [30306]

async function deleteTask() {
  for (const userId of userIds) {
    const userUrls = await URLs.findAll({
      where: {
        ownerId: userId,
      },
    })
    for (const url of userUrls) {
      await Events.destroy({ where: { code: url.code } })
      await url.destroy()
    }
    await Users.destroy({ where: { id: userId } })
  }
}

deleteTask()

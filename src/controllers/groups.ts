import { Groups, URLs } from '../db'

export const findUrlsInGroup = async (prefix: string) => {
  const group = await Groups.findOne({
    attributes: ['id'],
    where: {
      prefix,
    },
  })

  if (! group) {
    throw new Error('Group code not founded')
  }
  return URLs.findAll({
    where: {
      groupId: group.id,
    },
  })
}

export const findGroupById = async (id: number) => Groups.findById(id)

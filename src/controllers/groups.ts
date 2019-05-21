import { Groups, URLs } from '../db'

export const findUrlsInGroup = async (prefix: string) => {
  const group = await Groups.findOne({
    attributes: ['id'],
    where: {
      prefix,
    },
  })
  if (!group) {
    throw new Error('Group Code not found.')
  }
  return URLs.findAll({
    where: {
      groupId: group.id,
    },
  })
}

export const findGroupByPrefix = async (prefix: string) =>
  Groups.findOne({
    where: {
      prefix,
    },
  })

export const findGroupById = async (id: number) => Groups.findById(id)

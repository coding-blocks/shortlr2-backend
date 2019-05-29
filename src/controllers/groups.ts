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

export const findGroupByPrefix = async (prefix: string) => {
  const group = await Groups.findOne({
    where: {
      prefix,
    },
  })
  if (!group) {
    throw new Error('URL Group prefix not found. Wrong URL possibly.')
  }
  return group
}

export const findGroupById = async (id: number) => Groups.findById(id)

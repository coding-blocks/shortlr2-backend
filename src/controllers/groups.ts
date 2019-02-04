import { Groups } from '../db/models/Groups'

export const findGroupByPrefix = async (prefix: string) =>
  Groups.findOne({
    where: {
      prefix,
    },
  })

export const findGroupById = async (id: number) => Groups.findById(id)

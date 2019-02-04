import { Groups } from '../db'

export const findGroupByPrefix = async (prefix: string) =>
  Groups.findOne({
    where: {
      prefix,
    },
  })

export const findGroupById = async (id: number) => Groups.findById(id)

import { db } from "./db.server";
import { getUserId } from "./session.server";

export const makeRoom = async (request: Request, otherperson: string) => {
  const userId = await getUserId(request)
  if (userId) {
    const d = await getRoomId(request, otherperson)
    if (!d) {
      const room = await db.room.create({
        data: { users: `${userId}${otherperson}` }
      })
      return room
    }
  }
}

export const deleteRoom = async (request: Request, otherperson: string) => {
  const userId = await getUserId(request)
  if (userId) {
    const room = await db.room.delete({
      where: {
        users: `${userId}${otherperson}`
      }
    })
    return room
  }
}

export const getRoomId = async (request: Request, otherperson: string) => {
  const userId = await getUserId(request)
  if (userId) {
    const d = await db.room.findUnique({
      where: {
        users: `${userId}${otherperson}`
      }
    })

    const e = await db.room.findUnique({
      where: {
        users: `${otherperson}${userId}`
      }
    })

    return d || e
  }
  return null
}


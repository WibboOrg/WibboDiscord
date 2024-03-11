import dayjs from 'dayjs'
import { prisma } from '../prisma-client'

export class ChatLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await prisma.logChat.findFirst({
            select: {
                id: true,
            },
            orderBy: {
                id: 'desc',
            }
        })

        if(!result) return -1

        return result.id
    }

    static async loadLastLog(lastId: number)
    {
        const results = await prisma.logChat.findMany({
            where: {
                id: {
                    gt: lastId
                },
                user: {
                    accountCreated: {
                        gt: dayjs().subtract(2, 'hour').unix()
                    }
                }
            },
            select: {
                id: true,
                userName: true,
                message: true,
                timestamp: true
            },
        })

        if(!results.length) return []

        return results
    }
}

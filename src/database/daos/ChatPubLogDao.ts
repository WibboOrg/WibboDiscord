import { prisma } from '../prisma-client';

export class ChatPubLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await prisma.logChatPub.findFirst({
            select: {
                id: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        if(!result) return -1;

        return result.id;
    }

    static async loadLastLog(lastId: number)
    {
        const results = await prisma.logChatPub.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            orderBy: {
                id: 'asc'
            },
            take: 5,
            select: {
                id: true,
                userName: true,
                message: true,
                timestamp: true
            },
        })

        if(!results.length) return [];

        return results;
    }
}

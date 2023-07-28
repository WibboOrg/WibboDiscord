import { prisma } from '../prisma-client';

export class CmdLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await prisma.logCommand.findFirst({
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
        const results = await prisma.logCommand.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            orderBy: {
                id: 'asc'
            },
            take: 5
        })

        if(!results.length) return [];

        return results;
    }
}

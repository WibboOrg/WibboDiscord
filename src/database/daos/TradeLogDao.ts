import { prisma } from '../prisma-client';

export class TradeLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await prisma.logTrade.findFirst({
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
        const results = await prisma.logTrade.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            select: {
                id: true,
                time: true,
                userOneItems: true,
                userTwoItems: true,
                userOneTrade: {
                    select: {
                        username: true
                    }
                },
                userTwoTrade: {
                    select: {
                        username: true
                    }
                }
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

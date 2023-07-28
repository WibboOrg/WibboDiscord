import { prisma } from '../prisma-client';

export class LogLoginDao
{
    static async getLastId(): Promise<number>
    {
        const result = await prisma.logLogin.findFirst({
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
        const results = await prisma.logLogin.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            select: {
                id: true,
                date: true,
                ip: true,
                userAgent: true,
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })

        if(!results.length) return [];

        return results;
    }
}

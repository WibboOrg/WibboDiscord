import { prisma } from '../prisma-client'

export const logShopDao = {
    async getLastId(): Promise<number>
    {
        const result = await prisma.logShop.findFirst({
            select: {
                id: true
            },
            orderBy: {
                id: 'desc'
            }
        })

        if(!result) return -1

        return result.id
    },
    async loadLastLog(lastId: number)
    {
        const results = await prisma.logShop.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            select: {
                id: true,
                date: true,
                content: true,
                price: true,
                user: {
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

        if(!results.length) return []

        return results
    }
}

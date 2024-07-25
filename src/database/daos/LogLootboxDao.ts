import { prisma } from '../prisma-client'

export const logLootboxDao = {
    async getLastId(): Promise<number>
    {
        const result = await prisma.logLootbox.findFirst({
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
        const results = await prisma.logLootbox.findMany({
            where: {
                id: {
                    gt: lastId
                },
                itemBase: {
                    rarityLevel: {
                        gt: 1
                    }
                }
            },
            select: {
                id: true,
                interactionType: true,
                timestamp: true,
                user: {
                    select: {
                        username: true
                    }
                },
                itemBase: {
                    select: {
                        itemName: true,
                        rarityLevel: true
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

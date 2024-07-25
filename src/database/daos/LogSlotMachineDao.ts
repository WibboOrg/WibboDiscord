import { prisma } from '../prisma-client'

export const logSlotMachineDao = {
    async getLastId(): Promise<number>
    {
        const result = await prisma.logSlotmachine.findFirst({
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
        const results = await prisma.logSlotmachine.findMany({
            where: {
                id: {
                    gt: lastId
                },
            },
            select: {
                id: true,
                date: true,
                isWin: true,
                amount: true,
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

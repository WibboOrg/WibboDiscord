import { prisma } from '../prisma-client'

export const staffLogDao = {
    async getLastId(): Promise<number>
    {
        const result = await prisma.logStaff.findFirst({
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
        const results = await prisma.logStaff.findMany({
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

        if(!results.length) return []

        return results
    }
}

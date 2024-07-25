import { prisma } from '../prisma-client'
import {  } from '@wibbo/prisma'

export const cmdGameLogDao = {
    async getLastId(): Promise<number>
    {
        const result = await prisma.logCommand.findFirst({
            select: {
                id: true
            },
            where: {
                userName: 'WibboGame'
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
        const results = await prisma.logCommand.findMany({
            where: {
                AND: {
                    id: {
                        gt: lastId
                    },
                    userName: 'WibboGame'
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

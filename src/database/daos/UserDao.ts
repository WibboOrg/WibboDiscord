import { prisma } from '../prisma-client'

export const userDao =
{
    async getLastId(): Promise<number>
    {
        const result = await prisma.user.findFirst({
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
    async getUserById(id: number)
    {
        const result = await prisma.user.findFirst({
            where: { id }
        })

        if(!result) return null

        return result
    },
    async getLastUsers(lastId: number)
    {
        const results = await prisma.user.findMany({
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
    },
    async getUserByName(userName: string)
    {
        const result = await prisma.user.findFirst({
            where: { username: userName }
        })

        if(!result) return null

        return result
    },
    async getUserByNameOrMail(userNameOrMail: string)
    {
        const result = await prisma.user.findFirst({
            where: {
                OR: [{ username: userNameOrMail }, { mail: userNameOrMail }]
            }
        })

        if(!result) return null

        return result
    },
    async getUserIPByName(userName: string)
    {
        const result = await prisma.user.findFirst({
            where: {
                username: userName
            },
            select: {
                ipLast: true
            }
        })

        if(!result) return null

        return result
    },
    async getUserIdByUsername(userName: string)
    {
        const result = await prisma.user.findFirst({
            where: { username: userName },
            select: {
                id: true
            }
        })

        if(!result) return null

        return result
    },
    async getAllUsersByIp(
        IP: string,
    )
    {
        const results = await prisma.user.findMany({
            where: {
               ipLast: IP
            },
            select: {
                id: true,
                username: true
            }
        })

        if(!results) return []

        return results
    },
    async updateBan(name: string, banned: boolean)
    {
        await prisma.user.update({
            where: { username: name },
            data: { isBanned: banned }
        })
    }
}

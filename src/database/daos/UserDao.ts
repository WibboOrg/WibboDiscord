import { prisma } from '../prisma-client'

export class UserDao
{
    static async getLastId(): Promise<number>
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
    }

    static async getUserById(id: number)
    {
        const result = await prisma.user.findFirst({
            where: { id }
        })

        if(!result) return null

        return result
    }

    static async getLastUsers(lastId: number)
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
    }

    static async getUserByName(userName: string)
    {
        const result = await prisma.user.findFirst({
            where: { username: userName }
        })

        if(!result) return null

        return result
    }

    static async getUserByNameOrMail(userNameOrMail: string)
    {
        const result = await prisma.user.findFirst({
            where: {
                OR: [{ username: userNameOrMail }, { mail: userNameOrMail }]
            }
        })

        if(!result) return null

        return result
    }

    static async getUserIPByName(userName: string)
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
    }

    static async getUserIdByUsername(userName: string)
    {
        const result = await prisma.user.findFirst({
            where: { username: userName },
            select: {
                id: true
            }
        })

        if(!result) return null

        return result
    }

    static async getAllUsersByIp(
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
    }

    static async updateBan(name: string, banned: boolean)
    {
        await prisma.user.update({
            where: { username: name },
            data: { isBanned: banned }
        })
    }
}

import { prisma } from '../prisma-client'

export const ipStaffDao = {
    async updateIPStaff(userId: number, newIP: string): Promise<void>
    {
        await prisma.cmsStaffProtect.update({
            where: {
                id: userId
            },
            data: {
                ip: newIP
            }
        })
    }
}

import { prisma } from '../prisma-client'

export const serverStatusDao = {
    async getUserOnline(): Promise<number>
    {
        const result = await prisma.emulatorStatus.findFirst()

        if(!result) return 0

        return result.usersOnline
    }
}

import { prisma } from '../prisma-client';

export class ServerStatusDao
{
    static async getUserOnline(): Promise<number>
    {
        const result = await prisma.emulatorStatus.findFirst();

        if(!result) return 0;

        return result.usersOnline;
    }
}

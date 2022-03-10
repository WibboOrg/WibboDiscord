import { getManager, MoreThan } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';

export class UserDao
{
    static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(UserEntity, {
            select: ['id'],
            order: { id: 'DESC' },
        });

        if(!result) return -1;

        return result.id;
    }

    static async getUserById(id: number): Promise<UserEntity>
    {
        const result = await getManager().findOne(UserEntity, {
            where: { id },
        });

        if(!result) return null;

        return result;
    }

    static async getLastUsers(lastId: number): Promise<UserEntity[]>
    {
        const results = await getManager().find(UserEntity, {
            where: { id: MoreThan(lastId) },
            order: { id: 'ASC' },
            take: 5,
        });

        if(!results.length) return [];

        return results;
    }

    static async getUserByName(userName: string): Promise<UserEntity>
    {
        const result = await getManager().findOne(UserEntity, {
            where: { name: userName },
        });

        if(!result) return null;

        return result;
    }

    static async getUserIPByName(userName: string): Promise<UserEntity>
    {
        const result = await getManager().findOne(UserEntity, {
            select: ['ipLast'],
            where: { name: userName },
        });

        if(!result) return null;

        return result;
    }

    static async getUserIdByUsername(userName: string): Promise<UserEntity>
    {
        const result = await getManager().findOne(UserEntity, {
            select: ['id'],
            where: { name: userName },
        });

        if(!result) return null;

        return result;
    }

    static async getAllUsersByIpOrMachineId(
        IP: string,
        MachineId: string
    ): Promise<UserEntity[]>
    {
        MachineId = MachineId == '' ? 'empty' : MachineId;
        const results = await getManager().find(UserEntity, {
            select: ['id', 'name'],
            where: [{ ipLast: IP }, { machineId: MachineId }],
        });

        if(!results) return [];

        return results;
    }

    static async updateBan(name: string, banned: boolean)
    {
        await getManager()
            .createQueryBuilder()
            .update(UserEntity)
            .set({ isBanned: banned ? '1' : '0' })
            .where({ name })
            .execute();
    }
}

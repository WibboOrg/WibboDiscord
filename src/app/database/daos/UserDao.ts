import { getManager, MoreThan } from 'typeorm';
import { App } from '../../App';
import { UserEntity } from '../entities/UserEntity';

export class UserDao
{
    static async getLastId(): Promise<number>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async getUserById(id: number): Promise<UserEntity>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const result = await repository.findOne({
            where: { id },
        });

        if(!result) return null;

        return result;
    }

    static async getLastUsers(lastId: number): Promise<UserEntity[]>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const results = await repository.find({
            where: { id: MoreThan(lastId) },
            order: { id: 'ASC' },
            take: 5,
        });

        if(!results.length) return [];

        return results;
    }

    static async getUserByName(userName: string): Promise<UserEntity>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const result = await repository.findOne({
            where: { name: userName },
        });

        if(!result) return null;

        return result;
    }

    static async getUserIPByName(userName: string): Promise<UserEntity>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const result = await repository.findOne({
            select: ['ipLast'],
            where: { name: userName },
        });

        if(!result) return null;

        return result;
    }

    static async getUserIdByUsername(userName: string): Promise<UserEntity>
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        const result = await repository.findOne({
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
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        MachineId = MachineId == '' ? 'empty' : MachineId;
        const results = await repository.find({
            select: ['id', 'name'],
            where: [{ ipLast: IP }, { machineId: MachineId }],
        });

        if(!results) return [];

        return results;
    }

    static async updateBan(name: string, banned: boolean)
    {
        const repository = App.INSTANCE.database.getRepository(UserEntity);

        await repository
            .createQueryBuilder()
            .update(UserEntity)
            .set({ isBanned: banned ? '1' : '0' })
            .where({ name })
            .execute();
    }
}

import { database } from '../app-data-source';
import { LogLoginEntity } from '../entities/LogLoginEntity';

export class LogLoginDao
{
    static async getLastId(): Promise<number>
    {
        const repository = database.getRepository(LogLoginEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<LogLoginEntity[]>
    {
        const repository = database.getRepository(LogLoginEntity);

        const results = await repository
            .createQueryBuilder('loglogin')
            .select([
                'loglogin.id',
                'loglogin.date',
                'loglogin.ip',
                'loglogin.userAgent',
                'user.name',
            ])
            .where('loglogin.id > :lastId', { lastId })
            .innerJoin('loglogin.user', 'user')
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

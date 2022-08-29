import { getManager, MoreThan } from 'typeorm';
import { App } from '../../App';
import { LogLootboxEntity } from '../entities/LogLootboxEntity';

export class LogLootboxDao
{
    static async getLastId(): Promise<number>
    {
        const repository = App.INSTANCE.database.getRepository(LogLootboxEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<LogLootboxEntity[]>
    {
        const repository = App.INSTANCE.database.getRepository(LogLootboxEntity);

        const results = await repository
            .createQueryBuilder('loglootbox')
            .select([
                'loglootbox.id',
                'loglootbox.interactionType',
                'loglootbox.timestamp',
                'user.name',
                'itemBase.itemName',
                'itemBase.rarityLevel',
            ])
            .where('itemBase.rarityLevel != 1')
            .where('loglootbox.id > :lastId', { lastId })
            .innerJoin('loglootbox.user', 'user')
            .innerJoin('loglootbox.itemBase', 'itemBase')
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

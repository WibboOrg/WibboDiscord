import { database } from '../app-data-source';
import { LogShopEntity } from '../entities/LogShopEntity';

export class LogShopDao
{
    static async getLastId(): Promise<number>
    {
        const repository = database.getRepository(LogShopEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<LogShopEntity[]>
    {
        const repository = database.getRepository(LogShopEntity);

        const results = await repository.createQueryBuilder('boutique')
            .select(['boutique.id', 'boutique.date', 'boutique.content', 'boutique.price', 'user.name'])
            .where('boutique.id > :lastId', { lastId })
            .innerJoin('boutique.user', 'user')
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

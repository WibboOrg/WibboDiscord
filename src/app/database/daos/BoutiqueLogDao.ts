import { getManager, MoreThan } from 'typeorm';
import { App } from '../../App';
import { BoutiqueLogEntity } from '../entities/BoutiqueLogEntity';

export class BoutiqueLogDao
{
    static async getLastId(): Promise<number>
    {
        const repository = App.INSTANCE.database.getRepository(BoutiqueLogEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<BoutiqueLogEntity[]>
    {
        const repository = App.INSTANCE.database.getRepository(BoutiqueLogEntity);

        const results = await repository.createQueryBuilder('boutique')
            .select(['boutique.id', 'boutique.date', 'boutique.achat', 'user.name'])
            .where('boutique.id > :lastId', { lastId })
            .innerJoin('boutique.user', 'user')
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

import { getManager, MoreThan } from "typeorm";
import { BoutiqueLogEntity } from "../entities/BoutiqueLogEntity";

export class BoutiqueLogDao
{
    public static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(BoutiqueLogEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    public static async loadLastLog(lastId: number): Promise<BoutiqueLogEntity[]>
    {
        const results = await getManager()
        .createQueryBuilder(BoutiqueLogEntity, "boutique")
        .select(['boutique.id', 'boutique.date', 'boutique.achat', 'user.name'])
        .where('boutique.id > :lastId', { lastId })
        .innerJoin('boutique.user', 'user')
        .getMany();

        if(!results.length) return [];

        return results;
    }
}
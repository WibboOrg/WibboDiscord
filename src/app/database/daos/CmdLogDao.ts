import { getManager, MoreThan } from "typeorm";
import { CmdLogEntity } from "../entities/CmdLogEntity";

export class CmdLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(CmdLogEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    static async loadLastLog(lastId: number): Promise<CmdLogEntity[]>
    {
        const results = await getManager().find(CmdLogEntity, {
            where: { id: MoreThan(lastId) },
            order: { id: "ASC" },
            take: 5
        });

        if(!results.length) return [];

        return results;
    }
}
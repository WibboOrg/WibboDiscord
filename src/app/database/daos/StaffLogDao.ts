import { getManager, MoreThan } from "typeorm";
import { StaffLogEntity } from "../entities/StaffLogEntity";

export class StaffLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(StaffLogEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    static async loadLastLog(lastId: number): Promise<StaffLogEntity[]>
    {
        const results = await getManager().find(StaffLogEntity, {
            where: { id: MoreThan(lastId) },
            order: { id: "ASC" },
            take: 5
        });

        if(!results.length) return [];

        return results;
    }
}
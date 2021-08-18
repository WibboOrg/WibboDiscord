import { getManager, MoreThan } from "typeorm";
import { LogLoginEntity } from "../entities/LogLoginEntity";

export class LogLoginDao
{
    public static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(LogLoginEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    public static async loadLastLog(lastId: number): Promise<LogLoginEntity[]>
    {
        const results = await getManager()
        .createQueryBuilder(LogLoginEntity, "loglogin")
        .select(['loglogin.id', 'loglogin.date', 'loglogin.ip', 'loglogin.userAgent', 'user.name'])
        .where('loglogin.id > :lastId', { lastId })
        .innerJoin('loglogin.user', 'user')
        .getMany();

        if(!results.length) return [];

        return results;
    }
}
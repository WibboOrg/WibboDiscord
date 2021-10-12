import { getManager, MoreThan } from "typeorm";
import { TradeLogEntity } from "../entities/TradeLogEntity";

export class TradeLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(TradeLogEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    static async loadLastLog(lastId: number): Promise<TradeLogEntity[]>
    {
        const results = await getManager()
        .createQueryBuilder(TradeLogEntity, "logs_trade")
        .select(['logs_trade.id', 'logs_trade.time', 'logs_trade.userOneItems', 'logs_trade.userTwoItems', 'userOne.name', 'userTwo.name', 'logs_trade.roomId'])
        .where('logs_trade.id > :lastId', { lastId })
        .innerJoin('logs_trade.userOne', 'userOne')
        .innerJoin('logs_trade.userTwo', 'userTwo')
        .getMany();

        if(!results.length) return [];

        return results;
    }
}
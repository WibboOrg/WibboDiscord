import { getManager, MoreThan } from 'typeorm';
import { App } from '../../App';
import { TradeLogEntity } from '../entities/TradeLogEntity';

export class TradeLogDao
{
    static async getLastId(): Promise<number>
    {
        const repository = App.INSTANCE.database.getRepository(TradeLogEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<TradeLogEntity[]>
    {
        const repository = App.INSTANCE.database.getRepository(TradeLogEntity);

        const results = await repository
            .createQueryBuilder('log_trade')
            .select([
                'log_trade.id',
                'log_trade.time',
                'log_trade.userOneItems',
                'log_trade.userTwoItems',
                'userOne.name',
                'userTwo.name',
                'log_trade.roomId',
            ])
            .where('log_trade.id > :lastId', { lastId })
            .innerJoin('log_trade.userOne', 'userOne')
            .innerJoin('log_trade.userTwo', 'userTwo')
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

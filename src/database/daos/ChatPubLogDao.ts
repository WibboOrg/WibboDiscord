import { MoreThan } from 'typeorm';
import { database } from '../app-data-source';
import { ChatPubLogEntity } from '../entities/ChatPubLogEntity';

export class ChatPubLogDao
{
    static async getLastId(): Promise<number>
    {
        const repository = database.getRepository(ChatPubLogEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<ChatPubLogEntity[]>
    {
        const repository = database.getRepository(ChatPubLogEntity);

        const results = await repository.find({
            where: { id: MoreThan(lastId) },
            order: { id: 'ASC' },
            take: 5,
        });

        if(!results.length) return [];

        return results;
    }
}
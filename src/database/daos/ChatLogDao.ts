import { database } from '../app-data-source';
import { ChatLogEntity } from '../entities/ChatLogEntity';

export class ChatLogDao
{
    static async getLastId(): Promise<number>
    {
        const repository = database.getRepository(ChatLogEntity);

        const result = await repository.find({
            select: ['id'],
            order: { id: 'DESC' },
            take: 1
        });

        if(!result || !result.length) return -1;

        return result[0].id;
    }

    static async loadLastLog(lastId: number): Promise<ChatLogEntity[]>
    {
        const repository = database.getRepository(ChatLogEntity);

        const results = await repository
            .createQueryBuilder('chatlog')
            .select([
                'chatlog.id',
                'chatlog.userName',
                'chatlog.message',
                'chatlog.timestamp',
            ])
            .where(
                'chatlog.id > :lastId AND chatlog.user_id IN (SELECT id FROM user WHERE online = "1" AND account_created > UNIX_TIMESTAMP() - 7200)',
                { lastId }
            )
            .getMany();

        if(!results.length) return [];

        return results;
    }
}

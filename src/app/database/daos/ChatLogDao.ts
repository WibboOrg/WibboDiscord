import { getManager, MoreThan, In } from 'typeorm';
import { ChatLogEntity } from '../entities/ChatLogEntity';

export class ChatLogDao
{
    static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(ChatLogEntity, {
            select: ['id'],
            order: { id: 'DESC' },
        });

        if(!result) return -1;

        return result.id;
    }

    static async loadLastLog(lastId: number): Promise<ChatLogEntity[]>
    {
        const results = await getManager()
            .createQueryBuilder(ChatLogEntity, 'chatlog')
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

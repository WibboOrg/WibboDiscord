import { getManager, MoreThan } from "typeorm";
import { ChatPubLogEntity } from "../entities/ChatPubLogEntity";

export class ChatPubLogDao
{
    public static async getLastId(): Promise<number>
    {
        const result = await getManager().findOne(ChatPubLogEntity, {
            select: ['id'],
            order: { id: 'DESC' }
        });

        if(!result) return -1;

        return result.id;
    }

    public static async loadLastLog(lastId: number): Promise<ChatPubLogEntity[]>
    {
        const results = await getManager().find(ChatPubLogEntity, {
            where: { id: MoreThan(lastId) },
            order: { id: "ASC" },
            take: 5
        });

        if(!results.length) return [];

        return results;
    }
}
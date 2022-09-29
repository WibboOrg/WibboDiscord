import { ServerStatusEntity } from '../entities/ServerStatusEntity';
import { database } from '../app-data-source';

export class ServerStatusDao
{
    static async getUserOnline(): Promise<number>
    {
        const repository = database.getRepository(ServerStatusEntity);

        const result = await repository.findOne({ where: { 'id': 1 } });

        if(!result) return 0;

        return result.usersOnline;
    }
}

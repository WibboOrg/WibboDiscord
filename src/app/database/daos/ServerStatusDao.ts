import { App } from '../../App';
import { ServerStatusEntity } from '../entities/ServerStatusEntity';

export class ServerStatusDao
{
    static async getUserOnline(): Promise<number>
    {
        const repository = App.INSTANCE.database.getRepository(ServerStatusEntity);

        const result = await repository.findOne({ where: { 'id': 1 } });

        if(!result) return 0;

        return result.usersOnline;
    }
}

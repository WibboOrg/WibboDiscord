import { DiscordUserEntity } from '../entities/DiscordUserEntity';
import { database } from '../app-data-source';

export class DiscordUserDao
{
    static async getUserById(id: string): Promise<DiscordUserEntity>
    {
        const repository = database.getRepository(DiscordUserEntity);

        const result = await repository.findOne({
            select: ['id', 'name', 'experience'],
            where: { id },
        });

        if(!result) return null;

        return result;
    }

    static async getUserByName(name: string): Promise<DiscordUserEntity>
    {
        const repository = database.getRepository(DiscordUserEntity);

        const result = await repository.findOne({
            where: { name },
        });

        if(!result) return null;

        return result;
    }
}

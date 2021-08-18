import { getManager } from "typeorm";
import { DiscordUserEntity } from "../entities/DiscordUserEntity";

export class DiscordUserDao
{
    public static async getUserById(id: string): Promise<DiscordUserEntity>
    {
        const result = await getManager().findOne(DiscordUserEntity, {
            select: ['id', 'name', 'experience'],
            where: { id }
        });

        if(!result) return null;

        return result;
    }

    public static async getUserByName(name: string): Promise<DiscordUserEntity>
    {
        const result = await getManager().findOne(DiscordUserEntity, {
            where: { name }
        })

        if(!result) return null;

        return result;
    }
}
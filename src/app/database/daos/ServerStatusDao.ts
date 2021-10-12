import { getManager, MoreThan } from "typeorm";
import { ServerStatusEntity } from "../entities/ServerStatusEntity";

export class ServerStatusDao
{
    static async getUserOnline(): Promise<number>
    {
        const result = await getManager().findOne(ServerStatusEntity);

        if(!result) return 0;

        return result.usersOnline;
    }
}
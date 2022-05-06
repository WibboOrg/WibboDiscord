import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { BanDao } from '../../../database/daos/BanDao';
import dayjs from 'dayjs';

export class DeBanCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = ['ADMINISTRATOR'];
        const roles: RolesString[] = [];

        super(permissions, roles, 'deban');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const username = parts[0];

        const row = await UserDao.getUserByName(username);

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`);
            return;
        }

        const timestamp = dayjs().unix();

        try
        {
            BanDao.expireBan(row.name, row.ipLast, timestamp);
            UserDao.updateBan(row.name, false);

            message.reply(`Débannissement de ${username} ! (Compte + IP)`);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

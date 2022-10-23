import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import { BanDao } from '../../../database/daos/BanDao';
import dayjs from 'dayjs';

export class DeBanCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = [];

        super(permissions, roles, 'deban');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const username = parts[0];

        if(username === '')
        {
            message.reply('Veuillez mettre un nom d\'utilisateur en premier argument');
            return;
        }

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
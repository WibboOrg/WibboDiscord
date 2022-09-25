import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import { IPStaffDao } from '../../../database/daos/IPStaffDao';
import { checkIP } from '../../../common/utilities/Utils';

export class IPStaffCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Gestion'];

        super(permissions, roles, 'ipstaff');
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

        const IP = parts[1];

        if(!checkIP(IP))
        {
            message.reply('Veuillez mettre une IP en deuxième argument');
            return;
        }

        const row = await UserDao.getUserIdByUsername(username);

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`);
            return;
        }

        try
        {
            IPStaffDao.updateIPStaff(row.id, IP);

            message.channel.send(`La protection IP de ${username} est à jour !`);
            message.delete();
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

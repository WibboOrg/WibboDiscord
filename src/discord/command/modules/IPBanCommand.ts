import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import { sendMus } from '../../../network/Network';
import { BanDao } from '../../../database/daos/BanDao';
import dayjs from 'dayjs';
import { BanBantype } from 'wibboprisma';

export class IPBanCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Modérateur', 'Gestion'];

        super(permissions, roles, 'ipban');
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

        let reason = parts.slice(1).join(' ');
        reason = reason == '' ? 'Non respect des Conditions Générales d\'Utilisations' : reason;

        const row = await UserDao.getUserByName(username);

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`);
            return;
        }

        const timestamp = dayjs().add(2, 'year').unix();

        try
        {
            await sendMus('signout', row.id.toString());

            BanDao.insertBan(
                'ip',
                row.ipLast || '',
                reason,
                timestamp,
                message.author.username
            );
            BanDao.insertBan(
                'user',
                row.username,
                reason,
                timestamp,
                message.author.username
            );

            UserDao.updateBan(username, true);

            message.reply(`L'utilisateur ${username} a été bannit (Compte + IP)`);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

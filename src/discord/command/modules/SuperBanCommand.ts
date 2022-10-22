import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import { sendMus } from '../../../network/Network';
import { BanDao } from '../../../database/daos/BanDao';
import { BanType } from '../../../database/entities/BanEntity';
import dayjs from 'dayjs';

export class SuperBanCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Modérateur', 'Gestion'];

        super(permissions, roles, 'superban');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const username = parts[0];
        let reason = parts.slice(1).join(' ');
        reason = reason == '' ? 'Non respect de la Wibbo Attitude ainsi que des Conditions Générales d\'Utilisations' : reason;

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

        const timestamp = dayjs().add(2, 'year').unix();

        try
        {
            await sendMus('signout', row.id.toString());

            BanDao.insertBan(
                BanType.user,
                row.name,
                reason,
                timestamp,
                message.author.username
            );

            UserDao.updateBan(username, true);

            message.reply(`Superbannissement de ${username} ! (Compte)`);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

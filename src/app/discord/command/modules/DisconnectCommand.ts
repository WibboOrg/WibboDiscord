import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import { Network } from '../../../network/Network';

export class DisconnectCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Modérateur', 'Gestion'];

        super(permissions, roles, 'disconnect');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const username = parts[0];

        const row = await UserDao.getUserIdByUsername(username);

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`);
            return;
        }

        try
        {
            await Network.sendMessage('signout', row.id.toString());

            message.reply(`L'utilisateur ${username} a été déconnecté(e)`);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

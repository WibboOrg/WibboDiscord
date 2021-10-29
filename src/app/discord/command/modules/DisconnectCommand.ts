import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { Network } from '../../../network/Network';

export class DisconnectCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = ['ADMINISTRATOR'];
        const roles: RolesString[] = ['Administrateur', 'Modérateur', 'Gestion'];

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

            message.reply(`L'utilisateur ${username} a été déconnecté`);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';

export class GetAllUserAccountCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = [];

        super(
            permissions,
            roles,
            'getuseraccount',
            'doublecompte',
            'alluseracount'
        );
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

        const rows = await UserDao.getAllUsersByIpOrMachineId(
            row.ipLast,
            row.machineId
        );

        if(!rows)
        {
            message.reply('Aucun double compte trouvé');
        }

        let messageTxt = `voici les multicomptes de ${row.name}:\n`;
        messageTxt += '`';
        for(const row of rows)
        {
            messageTxt += row.name + ' ';
        }
        messageTxt += '`';

        message.channel.send(messageTxt);
    }
}

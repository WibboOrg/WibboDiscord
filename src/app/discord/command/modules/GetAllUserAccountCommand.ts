import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';

export class GetAllUserAccountCommand extends Command {

    constructor() {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = [];

        super(permissions, roles, "getuseraccount", "doublecompte", "alluseracount");
    }

    async parse(message: Message, parts: string[]) {
        if (!parts.length) return;

        const username = parts[0];

        const row = await UserDao.getUserByName(username);

        if (!row) { message.reply(`L'utilisateur ${username} n'existe pas !`); return; }

        const rows = await UserDao.getAllUsersByIpOrMachineId(row.ipLast, row.machineId);

        if (!rows) { message.reply(`Aucun double compte trouvé`); }

        let messageTxt = `voici les double comptes de ${row.name}:\n`;
        messageTxt += '`';
        for (const row of rows) {
            messageTxt += row.name + " ";
        }
        messageTxt += '`';

        message.channel.send(messageTxt);
    }
}
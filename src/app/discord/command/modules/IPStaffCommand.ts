import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { IPStaffDao } from '../../../database/daos/IPStaffDao';
import { App } from '../../../App';

export class IPStaffCommand extends Command {
    constructor() {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = ["Administrateur", "Gestion"];

        super(permissions, roles, "ipstaff");
    }

    public async parse(message: Message, parts: string[]) {
        if (!parts.length) return;

        const username = parts[0];

        const IP = parts[1];

        const row = await UserDao.getUserIdByUsername(username);

        if (!row) { message.reply(`L'utilisateur ${username} n'existe pas !`); return; }

        try {
            IPStaffDao.updateIPStaff(row.id, IP);

            message.channel.send(`La protection IP Staff de ${username} vient d'être mis à jour`); // Les IP sont confidentielles, elles ne doivent pas rester sur le flux de discussion
            message.delete();
        }

        catch (e) {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}
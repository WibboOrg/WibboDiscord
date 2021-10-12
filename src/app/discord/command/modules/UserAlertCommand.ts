import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { Network } from '../../../network/Network';

export class UserAlertCommand extends Command {

    constructor() {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = [];

        super(permissions, roles, "alert", "useralert");
    }

    async parse(message: Message, parts: string[]) {
        if (!parts.length) return;

        const username = parts[0];

        const msgText = parts.slice(1).join(' ');

        const row = await UserDao.getUserIdByUsername(username);

        if (!row) { message.reply(`L'utilisateur ${username} n'existe pas !`); return; }

        try {
            await Network.sendMessage('useralert', row.id.toString(), msgText);

            message.reply(`L'utilisateur ${username} a reçu l'alert`);
        }

        catch (e) {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}
import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { Network } from '../../../network/Network';
import { BanDao } from '../../../database/daos/BanDao';
import { BanType } from '../../../database/entities/BanEntity';
import moment from 'moment';
import { Config } from '../../../../Config';

export class IPBanCommand extends Command {
    constructor() {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = ["Administrateur", "Modérateur", "Gestion"];

        super(permissions, roles, "ipban");
    }

    async parse(message: Message, parts: string[]) {
        if (!parts.length) return;

        const username = parts[0];
        let reason = parts.slice(1).join(' ');
        reason = reason == '' ? "Non respect de la Wibbo Attitude ainsi que des Conditions Générales d'Utilisations" : reason;

        const row = await UserDao.getUserByName(username);

        if (!row) { message.reply(`L'utilisateur ${username} n'existe pas !`); return; }

        const timestamp = moment().add(2, 'year').unix();

        try {
            if (Config.serverMus.enable) await Network.sendMessage('signout', row.id.toString());

            BanDao.insertBan(BanType.ip, row.ipLast, reason, timestamp, message.author.username);
            BanDao.insertBan(BanType.user, row.name, reason, timestamp, message.author.username);

            UserDao.updateBan(username, true);

            message.reply(`L'utilisateur ${username} a été banni (Compte + IP)`);
        }

        catch (e) {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}
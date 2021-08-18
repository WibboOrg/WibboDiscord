import { Message, PermissionResolvable, RichEmbed } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import { BanDao } from '../../../database/daos/BanDao';
import moment from 'moment';

export class DeBanCommand extends Command 
{
    constructor() 
    {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = ["Administrateur", "Modérateur", "Gestion"];

        super(permissions, roles, "deban");
    }

    public async parse(message: Message, parts: string[]) 
    {
        if (!parts.length) return;

        const username = parts[0];

        const row = await UserDao.getUserByName(username);

        if (!row) { message.reply(`L'utilisateur ${ username } n'existe pas !`); return; }

        const date = new Date();
        const timestamp = moment().unix();

        try 
        {
            BanDao.expireBan(row.name, row.ipLast, timestamp);

            message.reply(`L'utilisateur ${ username } a été débanni (Compte + IP)`);
        }

        catch(e) 
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}
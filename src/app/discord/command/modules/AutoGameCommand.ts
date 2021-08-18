import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { Network } from '../../../network/Network';

export class AutoGameCommand extends Command 
{
    constructor() 
    {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = ["Administrateur", "Gestion"];

        super(permissions, roles, "autogame");
    }

    public async parse(message: Message, parts: string[]) 
    {
        if (!parts.length) return;

        const flag = parts[0] == 'true';

        try 
        {
            await Network.sendMessage('autogame', flag ? '1' : '0');

            message.reply(`L'animation de Jack & Daisy vient d'être ${ (flag) ? 'activée' : 'désactivée' }`);
        }

        catch(e) 
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}
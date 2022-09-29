import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { sendMus } from '../../../network/Network';

export class AutoGameCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Gestion'];

        super(permissions, roles, 'autogame');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const flag = parts[0] == 'true';

        try
        {
            await sendMus('autogame', flag ? '1' : '0');

            message.reply(` ${flag ? 'Activation' : 'Désactivation'} des animations automatiques de Daisy & Jack ! `);
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`);
        }
    }
}

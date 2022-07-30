import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';

export class PingCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [];
        const roles: string[] = ['everyone'];

        super(permissions, roles, 'ping', 'piping');
    }

    async parse(message: Message, parts: string[])
    {
        message.reply('Pong ! On fait un ping-pong ? Bon jeu de mot non ?');
    }
}

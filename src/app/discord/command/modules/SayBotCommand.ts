import { ChannelType, Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from 'discord.js';
import { Command } from '../Command';

export class SayBotCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = [];

        super(permissions, roles, 'say', 'saybot');
    }

    async parse(message: Message, parts: string[])
    {
        const msgText = parts.join(' ');

        const msgChannel = message.channel;

        if(!msgChannel) return;

        if(!((msgChannel): msgChannel is TextChannel => msgChannel.type === ChannelType.GuildText)(msgChannel))
            return;

        msgChannel.send(msgText);

        message.delete();
    }
}

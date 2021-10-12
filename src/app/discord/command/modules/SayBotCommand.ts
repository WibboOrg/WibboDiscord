import { Message, PermissionResolvable, TextChannel } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';

export class SayBotCommand extends Command {

    constructor() {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = [];

        super(permissions, roles, "say", "saybot");
    }

    async parse(message: Message, parts: string[]) {
        const msgText = parts.join(' ');

        const msgChannel = message.channel;

        if (!msgChannel) return;

        if (!((msgChannel): msgChannel is TextChannel => msgChannel.type === 'GUILD_TEXT')(msgChannel)) return;

        msgChannel.send(msgText);

        message.delete();
    }
}
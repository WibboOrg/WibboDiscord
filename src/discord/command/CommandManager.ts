import { Command } from './Command';
import { Message, PermissionFlagsBits } from 'discord.js';

import { PingCommand, UserInfoCommand, DisconnectCommand, GetAvatarCommand, SayBotCommand, GetAllUserAccountCommand, IPBanCommand, SuperBanCommand, DeBanCommand, UserAlertCommand, IPStaffCommand, AutoGameCommand, SetNicknameCommand, KickCommand, UnIgnoreallCommand } from './modules';

export const CommandManager = () =>
{
    const commands: Command[] = [
        new PingCommand,
        new UserInfoCommand,
        new DisconnectCommand,
        new GetAvatarCommand,
        new SayBotCommand,
        new GetAllUserAccountCommand,
        new IPBanCommand,
        new SuperBanCommand,
        new DeBanCommand,
        new UserAlertCommand,
        new IPStaffCommand,
        new AutoGameCommand,
        new SetNicknameCommand,
        new KickCommand,
        new UnIgnoreallCommand,
    ];

    const getCommand = (nameOrAlias: string): Command | null =>
    {
        for(const command of commands)
            if(command.aliases.indexOf(nameOrAlias) !== -1) return command;

        return null;
    };

    const havePermissions = (message: Message, command: Command): boolean =>
    {
        if (!message.member) return false;
        
        if(message.member.permissions.has(PermissionFlagsBits.Administrator)) return true;

        if(process.env.DISCORD_COMMAND_SALON_ID != '' && message.channel.id !== process.env.DISCORD_COMMAND_SALON_ID)
            return false;

        if(process.env.DISCORD_COMMAND_SALON_ID == '' && !command.hasPermissionsAndRoles(message.member))
            return false;

        return true;
    };

    const onMessage = (message: Message): boolean =>
    {
        if(!message.content.startsWith(process.env.DISCORD_PREFIX_CMD!)) return false;

        const parts = message.content.substring(process.env.DISCORD_PREFIX_CMD!.length).split(' ');

        if(!parts.length) return false;

        const command = getCommand(parts[0]);

        if(!command) return false;

        if(!havePermissions(message, command)) return false;

        parts.splice(0, 1);

        command.parse(message, parts);

        return true;
    };

    return { onMessage, havePermissions, getCommand };
};
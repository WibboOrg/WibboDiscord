import { Command } from './Command';

import { Message, PermissionFlagsBits } from 'discord.js';

import { Config } from '../../Config';
import { PingCommand, UserInfoCommand, DisconnectCommand, GetAvatarCommand, SayBotCommand, GetAllUserAccountCommand, IPBanCommand, SuperBanCommand, DeBanCommand, UserAlertCommand, IPStaffCommand, AutoGameCommand, SetNicknameCommand, KickCommand } from './modules';

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
    ];

    const getCommand = (nameOrAlias: string): Command =>
    {
        for(const command of commands)
            if(command.aliases.indexOf(nameOrAlias) !== -1) return command;

        return null;
    };

    const havePermissions = (message: Message, command: Command): boolean =>
    {
        if(message.member.permissions.has(PermissionFlagsBits.Administrator)) return true;

        if(Config.discord.commandSalonId != '' && message.channel.id !== Config.discord.commandSalonId)
            return false;

        if(Config.discord.commandSalonId == '' && !command.hasPermissionsAndRoles(message.member))
            return false;

        return true;
    };

    const onMessage = (message: Message): boolean =>
    {
        if(!message.content.startsWith(Config.discord.prefixCmd)) return false;

        const parts = message.content.substring(Config.discord.prefixCmd.length).split(' ');

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
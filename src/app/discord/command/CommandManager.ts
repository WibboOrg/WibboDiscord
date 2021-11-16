import { Command } from './Command';

import { Manager } from '../../common/Manager';
import { Message, Role } from 'discord.js';
import { PingCommand } from './modules/PingCommand';
import { UserInfoCommand } from './modules/UserInfoCommand';
import { DisconnectCommand } from './modules/DisconnectCommand';
import { GetAvatarCommand } from './modules/GetAvatarCommand';
import { SayBotCommand } from './modules/SayBotCommand';
import { GetAllUserAccountCommand } from './modules/GetAllUserAccountCommand';
import { IPBanCommand } from './modules/IPbanCommand';
import { SuperBanCommand } from './modules/SuperBanCommand';
import { DeBanCommand } from './modules/DeBanCommand';
import { UserAlertCommand } from './modules/UserAlertCommand';
import { IPStaffCommand } from './modules/IPStaffCommand';
import { AutoGameCommand } from './modules/AutoGameCommand';
import { SetNicknameCommand } from './modules/SetNicknameCommand';
import { KickCommand } from './modules/KickCommand';
import { Config } from '../../../Config';
// import { YoutubeCommand } from './modules/YoutubeCommand';

export class CommandManager extends Manager
{
    commands: Command[];

    constructor()
    {
        super('CommandManager');

        this.commands = [];
    }

    async onInit()
    {
        this.registerCommand(new PingCommand());
        this.registerCommand(new UserInfoCommand());
        this.registerCommand(new DisconnectCommand());
        this.registerCommand(new GetAvatarCommand());
        this.registerCommand(new SayBotCommand());
        this.registerCommand(new GetAllUserAccountCommand());
        this.registerCommand(new IPBanCommand());
        this.registerCommand(new SuperBanCommand());
        this.registerCommand(new DeBanCommand());
        this.registerCommand(new UserAlertCommand());
        this.registerCommand(new IPStaffCommand());
        this.registerCommand(new AutoGameCommand());
        this.registerCommand(new SetNicknameCommand());
        this.registerCommand(new KickCommand());
        // this.registerCommand(new YoutubeCommand());
    }

    async onDispose()
    {
        this.commands = [];
    }

    registerCommand(Command: Command)
    {
        this.commands.push(Command);
    }

    getCommand(nameOrAlias: string): Command
    {
        for(const command of this.commands)
            if(command.aliases.indexOf(nameOrAlias) !== -1) return command;

        return null;
    }

    havePermissions(message: Message, command: Command): boolean
    {
        if(message.member.permissions.has('ADMINISTRATOR')) return true;

        if(Config.discord.commandSalonId != '' && message.channel.id !== Config.discord.commandSalonId)
            return false;

        if(Config.discord.commandSalonId == '' && !command.hasPermissionsAndRoles(message.member))
            return false;

        return true;
    }

    onMessage(message: Message): boolean
    {
        if(!message) return false;

        if(!message.guild) return false;

        if(!message.content.startsWith(Config.discord.prefixCmd)) return false;

        const parts = message.content
            .substring(Config.discord.prefixCmd.length)
            .split(' ');

        if(!parts.length) return false;

        const command = this.getCommand(parts[0]);

        if(!command) return false;

        if(!this.havePermissions(message, command)) return false;

        parts.splice(0, 1);

        command.parse(message, parts);

        return true;
    }
}

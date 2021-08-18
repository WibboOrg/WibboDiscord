import { Command } from './Command';

import { Manager } from '../../common/Manager';
import { Message } from 'discord.js';
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
import { YoutubeCommand } from './modules/YoutubeCommand';
import { SetNicknameCommand } from './modules/SetNicknameCommand';

export class CommandManager extends Manager
{
    private _commands: Command[];

    constructor() 
    {
        super("CommandManager");

        this._commands = [];
    }

    public async onInit()
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
        this.registerCommand(new YoutubeCommand());
        this.registerCommand(new SetNicknameCommand());
    }

    public async onDispose()
    {
        this._commands = [];
    }

    private registerCommand(Command: Command)
    {
        this._commands.push(Command);
    }

    private getCommand(nameOrAlias: string): Command
    {
        for(const command of this._commands) if(command.aliases.indexOf(nameOrAlias) !== -1) return command;

        return null;
    }

    public onMessage(message: Message): boolean
    {
        if(!message) return false;

        if(!message.guild) return false;

        if(!message.content.startsWith("!")) return false;

        const parts = message.content.substr(1).split(' ');

        if(!parts.length) return false;

        const command = this.getCommand(parts[0]);

        if(!command) return false;

        if(message.channel.id !== '705254373202329631') return false;

        // if(!command.hasPermissionsAndRoles(message.member)) return false;

        parts.splice(0, 1);

        command.parse(message, parts);

        return true;
    }
}
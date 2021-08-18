import { Client, TextChannel, Message, GuildMember, MessageReaction } from 'discord.js';
import { CommandManager } from './command/CommandManager';
import { ModerationManager } from './moderation/ModerationManager';
import { LogManager } from './log/LogManager';
import { UserManager } from './user/UserManager';
import { Manager } from '../common/Manager';
import { App } from '../App';
import { ServerStatusDao } from '../database/daos/ServerStatusDao';
import WelcomeService from './service/WelcomeService';

export class DiscordBot extends Manager
{
    private _client: Client;
	private _commandManager: CommandManager;
	private _moderationManager: ModerationManager;
	private _logManager: LogManager;
	private _userManager: UserManager;
	private _timerUpdateOnline: NodeJS.Timeout;

	constructor() 
	{
		super("DiscordBot");

		this._client 		    = new Client();
		this._commandManager    = new CommandManager();
		this._moderationManager = new ModerationManager();
		this._logManager        = new LogManager();
		this._userManager		= new UserManager();
	}
	
	public async onInit()
	{
		await this._commandManager.init();
		await this._moderationManager.init();
		if(App.config.discord.checkLog) await this._logManager.init();
		await this._userManager.init();

		await this.loadClient();
	}

	public async onDispose()
	{
		await this._commandManager.dispose();
		await this._moderationManager.dispose();
		await this._logManager.dispose();
		await this._userManager.dispose();

		await this._client.destroy();
		
		clearInterval(this._timerUpdateOnline);
	}

	private async loadClient()
	{
		await this._client.login(App.config.discord.token);

		const isConnected = true;
		if(!isConnected)
		{
			this.logger.warn("Erreur lors de la connexion");
			return;
		}

		for(const guild of this._client.guilds.values()) this.logger.log(`[Guild] ${ guild.name } (${ guild.id })`);
			
		this._client.on('message', this.onBotMessage.bind(this));
		this._client.on('messageUpdate', this.onBotMessageUpdate.bind(this));
        this._client.on('guildMemberAdd', this.onBotMemberAdd.bind(this));
        this._client.on('guildMemberRemove', this.onBotMemberRemove.bind(this));
		this._client.on('error', console.error);

		this._client.user.setActivity(App.config.discord.activity, { type: App.config.discord.type });

		if(App.config.discord.activityOnlineUser) this._timerUpdateOnline = setInterval(() => this.onUpdateActivity(), 10 * 1000);

		const welcomeService = new WelcomeService();
		welcomeService.run();
	}

	private async onUpdateActivity()
	{
		const onlineUser = await ServerStatusDao.getUserOnline();

		this._client.user.setActivity(`les ${ onlineUser } Wibbo's en ligne!`, { type: "WATCHING" });
	}

	private onBotMessageUpdate(oldMessage: Message, newMessage: Message)
	{
		if(newMessage.author.bot) return;

		if(!newMessage.guild) return;

		if(this._moderationManager.onMessage(newMessage)) return;
	}

	private onBotMemberAdd(member: GuildMember) 
	{
		this.sendMessage(`${member.user} vient de faire son entrer! Il est le ${member.guild.memberCount}éme membre!`, "logs_welcome")
    }

	private onBotMemberRemove(member: GuildMember) 
	{
		this.sendMessage(`${member.user} vient de nous quitter. Nous sommes actuellement ${member.guild.memberCount} membre!`, "logs_welcome")
    }

	private async onBotMessage(message: Message) 
	{
		if(message.author.bot) return;

		if(!message.guild) return;

		if(this._moderationManager.onMessage(message)) return;

		if(this._commandManager.onMessage(message)) return;

		const user = await this._userManager.getUserByClientId(message.author.id);

		if(!user) return;

		await user.onMessage(message);
	}
	
	public getGuildMemberFromCommuById(id: number): GuildMember
	{
		const user = this._client.guilds.find(x => x.id == App.config.discord.communGuildId).members.find(x => x.id == id.toString());

		if(!user) return null;

		return user;
	}

	public sendMessage(message: string, channelName: string): void
	{
		try {
			const guild = this._client.guilds.find(x => x.id == App.config.discord.staffGuildId);

			if(!guild) return;

			const logChannel = guild.channels.find(ch => ch.name === channelName);

			if(!logChannel) return;

			if (!((logChannel): logChannel is TextChannel => logChannel.type === 'text')(logChannel)) return;

			logChannel.send(message);
		} catch(e) {
			console.log(e);
		}
	}
	
	public get client(): Client
	{
		return this._client;
	}
}
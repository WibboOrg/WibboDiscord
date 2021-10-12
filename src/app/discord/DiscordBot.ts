import { Client, TextChannel, Message, GuildMember, ActivityType, Intents } from 'discord.js';
import { CommandManager } from './command/CommandManager';
import { ModerationManager } from './moderation/ModerationManager';
import { LogManager } from './log/LogManager';
import { UserManager } from './user/UserManager';
import { Manager } from '../common/Manager';
import { ServerStatusDao } from '../database/daos/ServerStatusDao';
import WelcomeService from './service/WelcomeService';
import { Config } from '../../Config';

export class DiscordBot extends Manager {
    _client: Client;
    _commandManager: CommandManager;
    _moderationManager: ModerationManager;
    _logManager: LogManager;
    _userManager: UserManager;
    _timerUpdateOnline: NodeJS.Timeout;

    constructor() {
        super("DiscordBot");

        this._client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        this._commandManager = new CommandManager();
        this._moderationManager = new ModerationManager();
        this._logManager = new LogManager();
        this._userManager = new UserManager();
    }

    async onInit() {
        await this._commandManager.init();
        await this._moderationManager.init();
        if (Config.discord.checkLog) await this._logManager.init();
        await this._userManager.init();

        await this.loadClient();
    }

    async onDispose() {
        await this._commandManager.dispose();
        await this._moderationManager.dispose();
        await this._logManager.dispose();
        await this._userManager.dispose();

        await this._client.destroy();

        clearInterval(this._timerUpdateOnline);
    }

    async loadClient() {
        const isConnected = await this._client.login(Config.discord.token);

        if (!isConnected) {
            this.logger.warn("Erreur lors de la connexion");
            return;
        }

        for (const guild of this._client.guilds.cache.values()) this.logger.log(`[Guild] ${guild.name} (${guild.id})`);

        this._client.on('messageCreate', this.onBotMessage.bind(this));
        this._client.on('messageUpdate', this.onBotMessageUpdate.bind(this));
        this._client.on('guildMemberAdd', this.onBotMemberAdd.bind(this));
        this._client.on('guildMemberRemove', this.onBotMemberRemove.bind(this));
        this._client.on('error', console.error);

        this._client.user.setActivity(Config.discord.activity, { type: Config.discord.type as ActivityType });

        if (Config.discord.activityOnlineUser) this._timerUpdateOnline = setInterval(() => this.onUpdateActivity(), 10 * 1000);

        const welcomeService = new WelcomeService();
        welcomeService.run();
    }

    async onUpdateActivity() {
        const onlineUser = await ServerStatusDao.getUserOnline();

        this._client.user.setActivity(`les ${onlineUser} Wibbo's en ligne!`, { type: "WATCHING" });
    }

    onBotMessageUpdate(oldMessage: Message, newMessage: Message) {
        if (newMessage.author.bot) return;

        if (!newMessage.guild) return;

        if (this._moderationManager.onMessage(newMessage)) return;
    }

    onBotMemberAdd(member: GuildMember) {
        this.sendMessage(`${member.user} vient de faire son entrer! Il est le ${member.guild.memberCount}éme membre!`, "logs_welcome")
    }

    onBotMemberRemove(member: GuildMember) {
        this.sendMessage(`${member.user} vient de nous quitter. Nous sommes actuellement ${member.guild.memberCount} membre!`, "logs_welcome")
    }

    async onBotMessage(message: Message) {
        if (message.author.bot) return;

        if (!message.guild) return;

        if (this._moderationManager.onMessage(message)) return;

        if (this._commandManager.onMessage(message)) return;

        const user = await this._userManager.getUserByClientId(message.author.id);

        if (!user) return;

        await user.onMessage(message);
    }

    getGuildMemberFromCommuById(id: number): GuildMember {
        const user = this._client.guilds.cache.find(x => x.id == Config.discord.communGuildId).members.cache.find(x => x.id == id.toString());

        if (!user) return null;

        return user;
    }

    sendMessage(message: string, channelName: string): void {
        try {
            const guild = this._client.guilds.cache.find(x => x.id == Config.discord.staffGuildId);

            if (!guild) return;

            const logChannel = guild.channels.cache.find(ch => ch.name === channelName);

            if (!logChannel) return;

            if (!((logChannel): logChannel is TextChannel => logChannel.type === 'GUILD_TEXT')(logChannel)) return;

            logChannel.send(message);
        } catch (e) {
            console.log(e);
        }
    }

    get client(): Client {
        return this._client;
    }
}
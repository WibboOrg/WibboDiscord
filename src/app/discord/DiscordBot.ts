import { Client, TextChannel, Message, GuildMember, ActivityType, ChannelType, GatewayIntentBits, Partials } from 'discord.js';
import { CommandManager } from './command/CommandManager';
import { ModerationManager } from './moderation/ModerationManager';
import { LogManager } from './log/LogManager';
import { UserManager } from './user/UserManager';
import { Manager } from '../common/Manager';
import { ServerStatusDao } from '../database/daos/ServerStatusDao';
import { WelcomeHandler } from './handler/WelcomeHandler';
import { Config } from '../../Config';

export class DiscordBot extends Manager
{
    client: Client;
    commandManager: CommandManager;
    moderationManager: ModerationManager;
    logManager: LogManager;
    userManager: UserManager;
    timerUpdateOnline: NodeJS.Timer;

    constructor()
    {
        super('DiscordBot');

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents
            ],
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message]
        });
        this.commandManager = new CommandManager();
        this.moderationManager = new ModerationManager();
        this.logManager = new LogManager();
        this.userManager = new UserManager();
    }

    async onInit()
    {
        await this.commandManager.init();
        await this.moderationManager.init();
        if(Config.discord.checkLog) await this.logManager.init();
        await this.userManager.init();

        await this.loadClient();
    }

    async onDispose()
    {
        await this.commandManager.dispose();
        await this.moderationManager.dispose();
        await this.logManager.dispose();
        await this.userManager.dispose();

        this.client.destroy();

        clearInterval(this.timerUpdateOnline);
    }

    async loadClient()
    {
        const isConnected = await this.client.login(Config.discord.token);

        if(!isConnected)
        {
            this.logger.warn('Erreur lors de la connexion');
            return;
        }

        for(const guild of this.client.guilds.cache.values())
        {
            this.logger.log(`[Guild] ID: ${guild.id})`);
        }

        this.client.on('messageCreate', this.onBotMessage.bind(this));
        this.client.on('messageUpdate', this.onBotMessageUpdate.bind(this));
        this.client.on('guildMemberAdd', this.onBotMemberAdd.bind(this));
        this.client.on('guildMemberRemove', this.onBotMemberRemove.bind(this));

        this.client.on('error', console.error);

        this.client.user.setActivity(Config.discord.activity, {
            type: Config.discord.type,
        });

        if(Config.discord.activityOnlineUser)
            this.timerUpdateOnline = setInterval(() => this.onUpdateActivity(), 10 * 1000);

        const welcomeService = new WelcomeHandler();
        welcomeService.run();
    }

    async onUpdateActivity()
    {
        const onlineUser = await ServerStatusDao.getUserOnline();

        this.client.user.setActivity(`les ${onlineUser} Wibbo's en ligne!`, {
            type: ActivityType.Watching,
        });
    }

    onBotMessageUpdate(oldMessage: Message, newMessage: Message)
    {
        if(newMessage.author.bot) return;

        if(!newMessage.guild) return;

        if(this.moderationManager.onMessage(newMessage)) return;
    }

    onBotMemberAdd(member: GuildMember)
    {
        this.sendMessage(
            `${member.user} vient de faire son entrer! Il est le ${member.guild.memberCount}éme membre!`,
            'logs_welcome'
        );
    }

    onBotMemberRemove(member: GuildMember)
    {
        this.sendMessage(
            `${member.user} vient de nous quitter. Nous sommes actuellement ${member.guild.memberCount} membre!`,
            'logs_welcome'
        );
    }

    async onBotMessage(message: Message)
    {
        if(message.author.bot) return;

        if(!message.guild) return;

        if(this.moderationManager.onMessage(message)) return;

        if(this.commandManager.onMessage(message)) return;

        // const user = await this.userManager.getUserByClientId(message.author.id);

        // if (!user) return;

        // await user.onMessage(message);
    }

    getGuildMemberFromCommuById(id: number): GuildMember
    {
        const user = this.client.guilds.cache
            .find((x) => x.id == Config.discord.communGuildId)
            .members.cache.find((x) => x.id == id.toString());

        if(!user) return null;

        return user;
    }

    sendMessage(message: string, channelName: string): void
    {
        try
        {
            if(message === '' || channelName === '') return;

            const guild = this.client.guilds.cache.find((x) => x.id == Config.discord.staffGuildId);

            if(!guild) return;

            const logChannel = guild.channels.cache.find((ch) => ch.name === channelName);

            if(!logChannel) return;

            if(!((logChannel): logChannel is TextChannel => logChannel.type === ChannelType.GuildText)(logChannel))
                return;

            logChannel.send({ content: message });
        }
        catch (e)
        {
            console.log(e);
        }
    }
}
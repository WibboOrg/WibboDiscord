import { Client, TextChannel, Message, GuildMember, ActivityType, ChannelType, GatewayIntentBits, Partials } from 'discord.js';
import { CommandManager } from './command/CommandManager';
import { LogManager } from './log/LogManager';
import { ServerStatusDao } from '../database/daos/ServerStatusDao';
import { WelcomeReaction } from './reaction/WelcomeReaction';
import { Config } from '../Config';
import { AnimationReaction } from './reaction/AnimationReaction';

export const client = new Client({
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

let commandManager = null;

export const initialize = async () =>
{
    await loadClient();

    commandManager = CommandManager();
    const logManager = LogManager();
    const animationHandler = AnimationReaction();
    const welcomeHandler = WelcomeReaction();
};


const loadClient = async () =>
{
    const isConnected = await client.login(Config.discord.token);

    if(!isConnected)
    {
        console.warn('Erreur lors de la connexion');
        return;
    }

    for(const guild of client.guilds.cache.values())
    {
        console.log(`[Guild] ID: ${guild.id})`);
    }

    client.on('messageCreate', onBotMessage);
    client.on('messageUpdate', onBotMessageUpdate);
    client.on('guildMemberAdd', onBotMemberAdd);
    client.on('guildMemberRemove', onBotMemberRemove);

    client.on('error', console.error);

    client.user.setActivity(Config.discord.activity, {
        type: Config.discord.type,
    });

    if(Config.discord.activityOnlineUser)
        setInterval(() => onUpdateActivity(), 10 * 1000);
};

const onUpdateActivity = async () =>
{
    const onlineUser = await ServerStatusDao.getUserOnline();

    client.user.setActivity(`les ${onlineUser} Wibbo's en ligne!`, {
        type: ActivityType.Watching,
    });
};

const onBotMessageUpdate = (oldMessage: Message, newMessage: Message) =>
{
    if(newMessage.author.bot) return;

    if(!newMessage.guild) return;
};

const onBotMemberAdd = (member: GuildMember) =>
{
    sendMessage(
        `${member.user} vient de faire son entrer! Il est le ${member.guild.memberCount}éme membre!`,
        'logs_welcome'
    );
};

const onBotMemberRemove = (member: GuildMember) =>
{
    sendMessage(
        `${member.user} vient de nous quitter. Nous sommes actuellement ${member.guild.memberCount} membre!`,
        'logs_welcome'
    );
};

const onBotMessage = async (message: Message) =>
{
    if(!message) return;

    if(message.author.bot) return;

    if(!message.guild) return;

    if(commandManager.onMessage(message)) return;
};

export const sendMessage = async (message: string, channelName: string) =>
{
    try
    {
        if(message === '' || channelName === '') return;

        const guild = client.guilds.cache.find((x) => x.id == Config.discord.staffGuildId);

        if(!guild) return;

        const logChannel = guild.channels.cache.find((ch) => ch.name === channelName);

        if(!logChannel) return;

        if(!((logChannel): logChannel is TextChannel => logChannel.type === ChannelType.GuildText)(logChannel))
            return;

        await logChannel.send({ content: message });
    }
    catch (e)
    {
        console.log(e);
    }
};
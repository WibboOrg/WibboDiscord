import { Client, TextChannel, Message, GuildMember, ActivityType, ChannelType, GatewayIntentBits, Partials, PartialMessage, PartialGuildMember } from 'discord.js'
import { CommandManager } from './command/CommandManager'
import { LogManager } from './log/LogManager'
import { serverStatusDao } from '../database/daos'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
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
})

const commandManager = CommandManager()

export const initialize = async () => {
    await loadClient()

    await LogManager()
}


const loadClient = async () => {
    const isConnected = await client.login(process.env.DISCORD_TOKEN)

    if(!isConnected) {
        console.warn('Erreur lors de la connexion')
        return
    }

    for(const guild of client.guilds.cache.values())
        console.log(`[Guild] ID: ${guild.id})`)

    client.on('messageCreate', onBotMessage)
    client.on('messageUpdate', onBotMessageUpdate)
    client.on('guildMemberAdd', onBotMemberAdd)
    client.on('guildMemberRemove', onBotMemberRemove)

    client.on('error', console.error)

    client.user?.setActivity(process.env.DISCORD_ACTIVITY!, {
        type: parseInt(process.env.DISCORD_TYPE!),
    })

    if(process.env.DISCORD_ACTIVITY_ONLINE_USER === "true")
        setInterval(() => onUpdateActivity(), 10 * 1000)
}

const onUpdateActivity = async () => {
    const onlineUser = await serverStatusDao.getUserOnline()

    client.user?.setActivity(`les ${onlineUser} joueur's en ligne!`, {
        type: ActivityType.Watching,
    })
}

const onBotMessageUpdate = (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
    if(!newMessage.author || newMessage.author.bot) return

    if(!newMessage.guild) return
}

const onBotMemberAdd = (member: GuildMember) => {
    sendMessage(
        `${member.user} vient de faire son entrer! Il est le ${member.guild.memberCount}éme membre!`,
        'logs_welcome'
    )
}

const onBotMemberRemove = (member: GuildMember | PartialGuildMember) => {
    sendMessage(
        `${member.user} vient de nous quitter. Nous sommes actuellement ${member.guild.memberCount} membre!`,
        'logs_welcome'
    )
}

const onBotMessage = async (message: Message) => {
    if(!message) return

    if(message.author.bot) return

    if(!message.guild) return

    if(commandManager.onMessage(message)) return
}

export const sendMessage = async (message: string, channelName: string) => {
    try {
        if(message === '' || channelName === '') return

        const guild = client.guilds.cache.find((x) => x.id == process.env.DISCORD_STAFF_GUILD_ID)

        if(!guild) return

        const logChannel = guild.channels.cache.find((ch) => ch.name === channelName)

        if(!logChannel) return

        if(!((logChannel): logChannel is TextChannel => logChannel.type === ChannelType.GuildText)(logChannel))
            return

        await logChannel.send({ content: message })
    }
    catch (e) {
        console.log(e)
    }
}
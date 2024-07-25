import { ChannelType, Message, PermissionFlagsBits, TextChannel } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'saybot',
    permissions: [PermissionFlagsBits.Administrator],
    roles: [],

    parse: async (message: Message, parts: string[]) => {
        const msgText = parts.join(' ')

        const msgChannel = message.channel

        if(!msgChannel) return

        if(!((msgChannel): msgChannel is TextChannel => msgChannel.type === ChannelType.GuildText)(msgChannel))
            return

        msgChannel.send(msgText)

        message.delete().catch()
    }
} satisfies ICommand

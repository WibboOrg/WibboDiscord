import { EmbedBuilder, Message } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'getavatar',
    permissions: [],
    roles: ['everyone'],

    parse: async (message: Message, parts: string[]) =>
    {
        const user = message.mentions.users.first()

        if(!user)
        {
            message.reply('Veuillez mentionner un utilisateur.')
            return
        }

        if(!user.avatarURL())
        {
            message.reply('Cet utilisateur n\'a pas d\'avatar.')
            return
        }

        const embed = new EmbedBuilder()
            .setColor('#357EC7')
            .setTitle(`Avatar de ${user.username}`)
            .setImage(user.avatarURL())
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    }
} satisfies ICommand

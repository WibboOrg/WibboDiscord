import { Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'setnickname',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur'],
    parse: async (message: Message, parts: string[]) => {
        parts.splice(0, 1)

        const username = parts.join(' ')

        if(!username || username.length < 3)
        {
            message.reply('Choisissez un nouveau nom')
            return
        }

        const user = message.mentions.users.first()

        if(!user)
        {
            message.reply('Veuillez mentionner l\'utilisateur')
            return
        }

        const guild = message.guild

        if (!guild) return

        const guildMember = guild.members.cache.get(user.id)

        if(!guildMember)
        {
            message.reply('Cet utilisateur n\'existe pas')
            return
        }

        guildMember.setNickname(username)
    }
} satisfies ICommand

import { Message, PermissionFlagsBits } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'kick',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur'],

    parse: async (message: Message, parts: string[]) => {
        parts.splice(0, 1)

        const username = parts.join(' ')

        if(username === '')
        {
            message.reply('Veuillez mettre un pseudo en premier argument')
            return
        }

        const user = message.mentions.users.first()

        if(!user)
        {
            message.reply('Veuillez mentionner l\'utilisateur')
            return
        }

        const guild = message.guild

        if (!guild)
        {
            return
        }

        const guildMember = message.guild.members.cache.get(user.id)

        if(!guildMember)
        {
            message.reply('Cet utilisateur n\'existe pas')
            return
        }

        guildMember.kick(username)
        message.channel.send(`${username} vient d'être exclu(e) du Discord !`)
    }
} satisfies ICommand

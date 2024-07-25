import { Message, PermissionFlagsBits } from 'discord.js'
import { userDao } from '../../../database/daos'
import { ICommand } from '../../types'

export default {
    name: 'getuseraccount',
    permissions: [PermissionFlagsBits.Administrator],
    roles: [],

    parse: async (message: Message, parts: string[]) =>
    {
        if(!parts.length) return

        const username = parts[0]

        if(username === '')
        {
            message.reply('Veuillez mettre un nom d\'utilisateur en premier argument')
            return
        }

        const row = await userDao.getUserByName(username)

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`)
            return
        }

        const rows = await userDao.getAllUsersByIp(
            row.ipLast!
        )

        if(!rows)
        {
            message.reply('Aucun double compte trouvé')
        }

        let messageTxt = `voici les multicomptes de ${row.username}:\n`
        messageTxt += '`'
        for(const row of rows)
        {
            messageTxt += row.username + ' '
        }
        messageTxt += '`'

        message.channel.send(messageTxt)
    }
} satisfies ICommand

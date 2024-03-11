import { Message, PermissionFlagsBits } from 'discord.js'
import { UserDao } from '../../../database/daos/UserDao'
import { BanDao } from '../../../database/daos/BanDao'
import dayjs from 'dayjs'
import { ICommand } from '../../types'

export default {
    name: 'deban',
    permissions: [PermissionFlagsBits.Administrator],
    roles: [],
    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const username = parts[0]

        if(username === '')
        {
            message.reply('Veuillez mettre un nom d\'utilisateur en premier argument')
            return
        }

        const row = await UserDao.getUserByName(username)

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`)
            return
        }

        const timestamp = dayjs().unix()

        try
        {
            BanDao.expireBan(row.username, row.ipLast!, timestamp)
            UserDao.updateBan(row.username, false)

            message.reply(`Débannissement de ${username} ! (Compte + IP)`)
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`)
        }
    }
} satisfies ICommand
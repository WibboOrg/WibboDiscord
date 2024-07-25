import { Message, PermissionFlagsBits } from 'discord.js'
import { userDao } from '../../../database/daos'
import { sendMus } from '../../../network/Network'
import { ICommand } from '../../types'

export default {
    name: 'disconnect',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur', 'Modérateur', 'Gestion'],

    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const username = parts[0]

        if(username === '')
        {
            message.reply('Veuillez mettre un nom d\'utilisateur en premier argument')
            return
        }

        const row = await userDao.getUserIdByUsername(username)

        if(!row)
        {
            message.reply(`L'utilisateur ${username} n'existe pas !`)
            return
        }

        try
        {
            await sendMus('signout', row.id.toString())

            message.reply(`L'utilisateur ${username} a été déconnecté(e)`)
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`)
        }
    }
} satisfies ICommand

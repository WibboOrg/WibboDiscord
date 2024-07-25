import { Message, PermissionFlagsBits } from 'discord.js'
import { userDao, banDao } from '../../../database/daos'
import { sendMus } from '../../../network/Network'
import dayjs from 'dayjs'
import { ICommand } from '../../types'

export default {
    name: 'superban',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur', 'Modérateur', 'Gestion'],

    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const username = parts[0]
        let reason = parts.slice(1).join(' ')
        reason = reason == '' ? 'Non respect des Conditions Générales d\'Utilisations' : reason

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

        const timestamp = dayjs().add(2, 'year').unix()

        try
        {
            await sendMus('signout', row.id.toString())

            banDao.insertBan(
                'user',
                row.username,
                reason,
                timestamp,
                message.author.username
            )

            userDao.updateBan(username, true)

            message.reply(`Superbannissement de ${username} ! (Compte)`)
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`)
        }
    }
} satisfies ICommand

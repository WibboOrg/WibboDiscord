import { Message, PermissionFlagsBits, PermissionResolvable } from 'discord.js'
import { userDao, ipStaffDao } from '../../../database/daos'
import { validateIPAddress } from '../../utils'
import { ICommand } from '../../types'

export default {
    name: 'ipstaff',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur', 'Gestion'],
    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const username = parts[0]

        if(username === '')
        {
            message.reply('Veuillez mettre un nom d\'utilisateur en premier argument')
            return
        }

        const IP = parts[1]

        var isValidIP = validateIPAddress(IP)

        if(!isValidIP)
        {
            message.reply('Veuillez mettre une IP en deuxième argument')
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
            ipStaffDao.updateIPStaff(row.id, IP)

            message.channel.send(`La protection IP de ${username} est à jour !`)
            message.delete().catch()
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`)
        }
    }
} satisfies ICommand

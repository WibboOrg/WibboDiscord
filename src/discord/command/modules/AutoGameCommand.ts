import { Message, PermissionFlagsBits } from 'discord.js'
import { sendMus } from '../../../network/Network'
import { ICommand } from '../../types'

export default {
    name: 'autogame',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur', 'Gestion'],

    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const flag = parts[0] == 'true'

        try
        {
            await sendMus('autogame', flag ? '1' : '0')

            message.reply(` ${flag ? 'Activation' : 'Désactivation'} des animations automatiques de Daisy & Jack ! `)
        }
        catch (e)
        {
            message.reply(`Une erreur s'est produite: ${e}`)
        }
    }
} satisfies ICommand
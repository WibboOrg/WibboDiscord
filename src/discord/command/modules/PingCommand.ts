import { Message } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'ping',
    permissions: [],
    roles: ['everyone'],
    parse: async (message: Message, parts: string[]) => {
        message.reply('Pong !')
        message.reply('Alors on se fait ce ping-pong ?')
        message.reply('Répondez-moi?')
        message.reply('Né(e) pour faire chier le monde')
    }
} satisfies ICommand

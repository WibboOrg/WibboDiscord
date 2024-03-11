import { Message, PermissionResolvable } from 'discord.js'
import { ICommand } from '../../types'

export default {
    name: 'ping',
    permissions: [],
    roles: ['everyone'],
    parse: async (message: Message, parts: string[]) => {
        message.reply('Pong ! On fait un ping-pong ?')
    }
} satisfies ICommand

import { Message, PermissionFlagsBits } from 'discord.js'

import * as modules from './modules'
import { ICommand } from '../types'

export const CommandManager = () => {
    const commands: ICommand[] = Object.values(modules).map(x => x)

    const getCommand = (name: string): ICommand | null => {
        for(const command of commands)
            if(command.name.indexOf(name) !== -1) return command

        return null
    }

    const havePermissions = (message: Message, command: ICommand): boolean => {
        if (!message.member) return false
        
        if(message.member.permissions.has(PermissionFlagsBits.Administrator)) return true

        if(process.env.DISCORD_COMMAND_SALON_ID != '' && message.channel.id !== process.env.DISCORD_COMMAND_SALON_ID)
            return false

        if(process.env.DISCORD_COMMAND_SALON_ID == '' && !(message.member.permissions.has(command.permissions) || message.member.roles.cache.some((role) => command.roles.includes(role.name))))
            return false

        return true
    }

    const onMessage = (message: Message): boolean => {
        if(!message.content.startsWith(process.env.DISCORD_PREFIX_CMD!)) return false

        const parts = message.content.substring(process.env.DISCORD_PREFIX_CMD!.length).split(' ')

        if(!parts.length) return false

        const command = getCommand(parts[0])

        if(!command) return false

        if(!havePermissions(message, command)) return false

        parts.splice(0, 1)

        command.parse(message, parts)

        return true
    }

    return { onMessage }
}
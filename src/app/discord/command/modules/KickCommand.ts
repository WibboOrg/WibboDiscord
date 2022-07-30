import { Message, PermissionFlagsBits, PermissionResolvable, TextChannel } from 'discord.js';
import { Command } from '../Command';

export class KickCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur'];

        super(permissions, roles, 'kick');
    }

    async parse(message: Message, parts: string[])
    {
        parts.splice(0, 1);

        const username = parts.join(' ');

        const user = message.mentions.users.first();

        if(!user)
        {
            message.reply('Veuillez mentionner l\'utilisateur');
            return;
        }

        const guildMember = message.guild.members.cache.get(user.id);

        if(!guildMember)
        {
            message.reply('Cet utilisateur n\'existe pas');
            return;
        }

        guildMember.kick(username);
        message.channel.send(`${username} vient d'être exclu(e) du Discord !`);
    }
}

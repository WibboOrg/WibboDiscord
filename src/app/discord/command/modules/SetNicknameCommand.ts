import { Message, PermissionResolvable, TextChannel } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';

export class SetNicknameCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = ['ADMINISTRATOR'];
        const roles: RolesString[] = ['Administrateur'];

        super(permissions, roles, 'setnickname');
    }

    async parse(message: Message, parts: string[])
    {
        parts.splice(0, 1);

        const username = parts.join(' ');

        if(!username || username.length < 3)
        {
            message.reply('Choisissez un nouveau nom');
            return;
        }

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

        guildMember.setNickname(username);
    }
}

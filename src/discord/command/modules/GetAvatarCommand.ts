import { EmbedBuilder, Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';

export class GetAvatarCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [];
        const roles: string[] = ['everyone'];

        super(permissions, roles, 'getavatar');
    }

    async parse(message: Message, parts: string[])
    {
        const user = message.mentions.users.first();

        if(!user)
        {
            message.reply('Veuillez mentionner un utilisateur.');
            return;
        }

        if(!user.avatarURL())
        {
            message.reply('Cet utilisateur n\'a pas d\'avatar.');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#357EC7')
            .setTitle(`Avatar de ${user.username}`)
            .setImage(user.avatarURL())
            .setTimestamp()
            .setFooter({ text: 'WIBBO.ORG', iconURL: 'https://cdn.discordapp.com/emojis/532140688167665664.png' });

        message.channel.send({ embeds: [embed] });
    }
}

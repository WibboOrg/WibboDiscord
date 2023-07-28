import { TextChannel, MessageReaction, ChannelType } from 'discord.js';
import { client } from '../bot';

export const WelcomeReaction = async () =>
{
    const guild = client.guilds.cache.find((x) => x.id == process.env.DISCORD_STAFF_GUILD_ID);

    if(!guild) return;

    const welcomeChannel = guild.channels.cache.find((ch) => ch.name === 'bienvenue');

    if(!welcomeChannel) return;

    if(!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === ChannelType.GuildText)(welcomeChannel))
        return;

    const message = welcomeChannel.messages.cache.first();

    if(!message) return;

    const memberRole = message.guild.roles.cache.find(
        (role) => role.name === 'Membre'
    );

    if(!memberRole) return;

    const collector = message.createReactionCollector();
    collector.on('collect', (r: MessageReaction) =>
    {
        const lastUser = r.users.cache.last();
        if(!lastUser || lastUser.id === message.author.id) return;

        const guild = client.guilds.cache.find((x) => x.id == process.env.DISCORD_COMMUN_GUILD_ID!)

        if (!guild) return;

        const member = guild.members.cache.find((x) => x.id == lastUser.id);

        if(!member) return;

        if(member.roles.cache.has(memberRole.name)) return;

        member.roles.add(memberRole);

        //r.remove(member.id);
    });
};

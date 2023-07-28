import { TextChannel, MessageReaction, ReactionCollector, ChannelType } from 'discord.js';
import { client } from '../bot';

export const AnimationReaction = () =>
{
    const guild = client.guilds.cache.find((x) => x.id == process.env.DISCORD_STAFF_GUILD_ID);

    if(!guild) return;

    const welcomeChannel = guild.channels.cache.find((ch) => ch.name === 'bienvenue');

    if(!welcomeChannel) return;

    if(!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === ChannelType.GuildText)(welcomeChannel))
        return;

    const message = welcomeChannel.messages.cache.first();

    if(!message) return;

    const messageId = message.author.id;

    const collector = message.createReactionCollector();
    collector.on('collect', (reaction: MessageReaction) =>
    {
        const lastUser = reaction.users.cache.last();

        if(!lastUser || lastUser.id === messageId) return;

        const guild = client.guilds.cache.find((x) => x.id == process.env.DISCORD_COMMUN_GUILD_ID!);

        if (!guild) return;
            
        const member = guild.members.cache.find((x) => x.id == lastUser.id);

        if(!member) return;

        if(reaction.emoji.name == '') return;

        reaction.remove();
    });
};

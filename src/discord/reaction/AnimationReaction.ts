import { TextChannel, MessageReaction, ReactionCollector, ChannelType } from 'discord.js';
import { Config } from '../../config';
import { client } from '../bot';

export const AnimationReaction = () =>
{
    const guild = client.guilds.cache.find((x) => x.id == Config.discord.staffGuildId);

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
        if(reaction.users.cache.last().id === messageId) return;

        const member = client.guilds.cache
            .find((x) => x.id == Config.discord.communGuildId)
            .members.cache.find((x) => x.id == reaction.users.cache.last().id);

        if(!member) return;

        if(reaction.emoji.name == '') return;

        reaction.remove();
    });
};

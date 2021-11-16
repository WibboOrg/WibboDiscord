import { App } from '../../App';
import { TextChannel, MessageReaction } from 'discord.js';
import { Config } from '../../../Config';

export default class WelcomeService
{
    async run()
    {
        const guild = App.INSTANCE.discordBot.client.guilds.cache.find((x) => x.id == Config.discord.staffGuildId);

        if(!guild) return;

        const welcomeChannel = guild.channels.cache.find((ch) => ch.name === 'bienvenue');

        if(!welcomeChannel) return;

        if(!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'GUILD_TEXT')(welcomeChannel))
            return;

        const message = await welcomeChannel.messages.cache.first();

        if(!message) return;

        const memberRole = message.guild.roles.cache.find(
            (role) => role.name === 'Membre'
        );

        if(!memberRole) return;

        const collector = message.createReactionCollector();
        collector.on('collect', (r: MessageReaction) =>
        {
            if(r.users.cache.last().id === message.author.id) return;

            const member = App.INSTANCE.discordBot.client.guilds.cache
                .find((x) => x.id == Config.discord.communGuildId)
                .members.cache.find((x) => x.id == r.users.cache.last().id);

            if(!member) return;

            if(member.roles.cache.has(memberRole.name)) return;

            member.roles.add(memberRole);

            //r.remove(member.id);
        });
    //collector.stop();
    }
}

import { App } from "../../App";
import { TextChannel, MessageReaction } from "discord.js";

export default class WelcomeService {

    public async run()
    {
        const guild = App.discordBot.client.guilds.find(x => x.id == App.config.discord.staffGuildId);

		if(!guild) return;

		const welcomeChannel = guild.channels.find(ch => ch.name === "bienvenue");

		if(!welcomeChannel) return;

		if (!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'text')(welcomeChannel)) return;

		const messages = await welcomeChannel.fetchMessages({ limit: 1 });

		if(!messages) return;

		const message = messages.first();

		if(!message) return;

		const memberRole = message.guild.roles.find(role => role.name === "Membre");

		if(!memberRole) return;

		const collector = message.createReactionCollector(r => true);
		collector.on('collect', (r: MessageReaction) => {

			if (r.users.last().id === message.author.id) return;

			const member = App.discordBot.client.guilds.find(x => x.id == App.config.discord.communGuildId).members.find(x => x.id == r.users.last().id)
				
			if(!member) return;

			if(member.roles.has(memberRole.name)) return;

			member.addRole(memberRole);
			
			//r.remove(member.id);
		});
		//collector.stop();
    }
}
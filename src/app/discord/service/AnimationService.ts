import { App } from "../../App";
import { TextChannel, MessageReaction, ReactionCollector } from "discord.js";

export default class AnimationService {

	private _collector: ReactionCollector;
	private _messageId: string;
	
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

		this._messageId = message.author.id;

		this._collector = message.createReactionCollector(r => true);
		this._collector.on('collect', this.onReaction.bind(this));
    }

	public dispose(): void
	{
		this._collector.stop();
		this._collector = null;
	}

	private onReaction(reaction: MessageReaction)
	{
		if (reaction.users.last().id === this._messageId) return;

		const member = App.discordBot.client.guilds.find(x => x.id == App.config.discord.communGuildId).members.find(x => x.id == reaction.users.last().id)
				
        if(!member) return;
            
        if(reaction.emoji.name == '') return;
			
		reaction.remove(member.id);
	}
}
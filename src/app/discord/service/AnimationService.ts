import { App } from "../../App";
import { TextChannel, MessageReaction, ReactionCollector } from "discord.js";
import { Config } from "../../../Config";

export default class AnimationService {

    _collector: ReactionCollector;
    _messageId: string;

    async run() {
        const guild = App.INSTANCE.discordBot.client.guilds.cache.find(x => x.id == Config.discord.staffGuildId);

        if (!guild) return;

        const welcomeChannel = guild.channels.cache.find(ch => ch.name === "bienvenue");

        if (!welcomeChannel) return;

        if (!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'GUILD_TEXT')(welcomeChannel)) return;

        const message = welcomeChannel.messages.cache.first();

        if (!message) return;

        this._messageId = message.author.id;

        this._collector = message.createReactionCollector();
        this._collector.on('collect', this.onReaction.bind(this));
    }

    dispose(): void {
        this._collector.stop();
        this._collector = null;
    }

    onReaction(reaction: MessageReaction) {
        if (reaction.users.cache.last().id === this._messageId) return;

        const member = App.INSTANCE.discordBot.client.guilds.cache.find(x => x.id == Config.discord.communGuildId).members.cache.find(x => x.id == reaction.users.cache.last().id)

        if (!member) return;

        if (reaction.emoji.name == '') return;

        reaction.remove();
    }
}
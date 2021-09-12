import { Message, MessageEmbed, Permissions } from "discord.js";
import { Manager } from "../../common/Manager";

export class ModerationManager extends Manager {
    private _wordFilter: string[];

    constructor() {
        super("ModerationManager");

        this._wordFilter = [];
    }

    public async onInit() {
        this._wordFilter.push("badword");
    }

    public async onDispose() {
        this._wordFilter = [];
    }

    public onMessage(message: Message): boolean {
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return false;

        const messageText = message.content;

        if (this.hasBadWord(messageText)) {
            const embed = new MessageEmbed()
                .setTitle(`Avertissement pour ${message.author.username} !`)
                .setThumbnail(message.author.avatarURL())
                .addField("Raison", "Mot interdit");

            message.channel.send({ embeds: [embed] })
            message.delete();

            return true;
        }

        return false;
    }

    private hasBadWord(text: string): boolean {
        if (!text.length) return false;

        text = text.toLowerCase();

        for (const word of this._wordFilter) if (text.indexOf(word) !== -1) return true;

        return false;
    }
}
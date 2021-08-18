import { Message, RichEmbed } from "discord.js";
import { Manager } from "../../common/Manager";

export class ModerationManager extends Manager
{
    private _wordFilter: string[];

    constructor()
    {
        super("ModerationManager");

        this._wordFilter = [];
    }

    public async onInit()
    {
        this._wordFilter.push("badword");
    }

    public async onDispose()
    {
        this._wordFilter = [];
    }

    public onMessage(message: Message): boolean
    {
        if(message.member?.hasPermission("ADMINISTRATOR")) return false;

        const messageText = message.content;

        if(this.hasBadWord(messageText))
        { 
            const embed = new RichEmbed()
                .setTitle(`Avertissement pour ${ message.author.username } !`)
                .setThumbnail(message.author.avatarURL)
                .addField("Raison", "Mot interdit");

            message.channel.send(embed)
            message.delete();

            return true;
        }

        return false;
    }

    private hasBadWord(text: string): boolean
    {
        if(!text.length) return false;

        text = text.toLowerCase();

        for(const word of this._wordFilter) if(text.indexOf(word) !== -1) return true;

        return false;
    }
}
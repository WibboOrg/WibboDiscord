import { Message, PermissionResolvable } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import ytdl from 'ytdl-core';

export class YoutubeCommand extends Command {
    constructor() {
        const permissions: PermissionResolvable[] = ["SPEAK"];
        const roles: RolesString[] = ["everyone"];

        super(permissions, roles, "youtube");
    }

    async parse(message: Message, parts: string[]) {
        if (!parts.length) return;

        const url = parts[0];

        // try {
        //     if (!ytdl.validateURL(url)) throw new Error('Vous devez fourni une vidéo correct')

        //     const info = await ytdl.getInfo(url);

        //     if (!info) throw new Error('La vidéo Youtube n\'existe pas')

        //     const voiceChannel = message.member.voice.channel;
        //     if (!voiceChannel) throw new Error('Vous devez rejoindre un channel vocal')

        //     const connection = await voiceChannel.;
        //     const stream = ytdl.downloadFromInfo(info, { filter: 'audioonly' });

        //     const dispatcher = connection.playStream(stream, { seek: 0, volume: 1 });
        //     dispatcher.on("end", end => { voiceChannel.leave(); });

        //     const embed = new RichEmbed()
        //         .setColor('#357EC7')
        //         .setTitle(info.videoDetails.title)
        //         .setURL(info.videoDetails.video_url)
        //         .addField("Catégorie", info.videoDetails.category)
        //         .addField("Description", info.videoDetails.description.substring(0, 50) + '...')
        //         .addField("Temps en secondes", info.videoDetails.lengthSeconds)
        //         .setAuthor(info.videoDetails.author.name)
        //         .setThumbnail(info.videoDetails.thumbnails[0].url)
        //         .setTimestamp()
        //         .setFooter('Wibbo.org', 'https://cdn.discordapp.com/emojis/532140688167665664.png');

        //     message.channel.send(embed);
        // }

        // catch (e) {
        //     message.reply(`Une erreur s'est produite: ${e}`);
        // }
    }
}
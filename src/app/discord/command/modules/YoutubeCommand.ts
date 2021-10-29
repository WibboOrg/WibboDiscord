// import { Message, MessageEmbed, PermissionResolvable } from 'discord.js';
// import { Command } from '../Command';
// import { RolesString } from '../RolesString';
// import ytdl from "discord-ytdl-core";
// import { createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, generateDependencyReport, joinVoiceChannel, StreamType, VoiceConnectionStatus } from '@discordjs/voice';

// export class YoutubeCommand extends Command {
//     constructor() {
//         const permissions: PermissionResolvable[] = ["SPEAK"];
//         const roles: RolesString[] = ["everyone"];

//         super(permissions, roles, "youtube");
//     }

//     async parse(message: Message, parts: string[]) {
//         if (!parts.length) return;

//         console.log(generateDependencyReport());

//         const url = parts[0];

//         try {
//             if (!ytdl.validateURL(url)) throw new Error('Vous devez fourni une vidéo correct')

//             const info = await ytdl.getInfo(url);

//             if (!info) throw new Error('La vidéo Youtube n\'existe pas')

//             const voiceChannel = message.member.voice.channel;
//             if (!voiceChannel) throw new Error('Vous devez rejoindre un channel vocal')

//             let conn = joinVoiceChannel({
//                 guildId: voiceChannel.guild.id,
//                 channelId: voiceChannel.id,
//                 adapterCreator: voiceChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
//             });

//             try {
//                 conn = await entersState(conn, VoiceConnectionStatus.Ready, 20000);
//             } catch (err) {
//                 conn.destroy();
//             }

//             conn.rejoin();

//             await entersState(conn, VoiceConnectionStatus.Ready, 10000);

//             const embed = new MessageEmbed()
//                 .setColor('#357EC7')
//                 .setTitle(info.videoDetails.title)
//                 .setURL(info.videoDetails.video_url)
//                 .addField("Catégorie", info.videoDetails.category)
//                 .addField("Description", info.videoDetails.description.substring(0, 50) + '...')
//                 .addField("Temps en secondes", info.videoDetails.lengthSeconds)
//                 .setAuthor(info.videoDetails.author.name)
//                 .setThumbnail(info.videoDetails.thumbnails[0].url)
//                 .setTimestamp()

//             message.channel.send({ embeds: [embed] });
//         }

//         catch (e) {
//             message.reply(`Une erreur s'est produite: ${e}`);
//         }
//     }
// }

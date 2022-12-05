import { Message, PermissionResolvable, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../Command';
import { UserDao } from '../../../database/daos/UserDao';
import dayjs from 'dayjs';
import { UserEntity } from '../../../database/entities/UserEntity';

export class UserInfoCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = [PermissionFlagsBits.Administrator];
        const roles: string[] = ['Administrateur', 'Gestion'];

        super(permissions, roles, 'userinfo', 'infouser');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const usernameOrId = parts[0];

        if(usernameOrId === '')
        {
            message.reply('Veuillez mettre un no d\'utilisateur ou un ID en premier argument');
            return;
        }

        let row: UserEntity = null;
        if(this.isNumber(usernameOrId))
            row = await UserDao.getUserById(parseInt(usernameOrId));

        if(!row) row = await UserDao.getUserByNameOrMail(usernameOrId);

        if(!row)
        {
            message.reply(`L'utilisateur ${usernameOrId} n'existe pas !`);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#357EC7')
            .setTitle('Information sur ' + row.name)
            .setURL('https://wibbo.org/profil/' + row.name)
            .addFields([
                { name: 'Id', value: row.id.toString() },
                { name: 'Mission', value: row.motto ? row.motto : 'Aucune mission' },
                { name: 'Email', value: row.mail ? row.mail : 'Aucune e-mail' },
                { name: 'Pays', value: row.ipCountry ? row.ipCountry : 'Non localisé' },
                { name: 'Statut', value: row.online == 1 ? 'En ligne' : 'Hors-ligne' },
                { name: 'Crée le', value: dayjs.unix(row.accountCreated).format('DD/MM/YYYY à hh:mm') },
                { name: 'Dernière connexion', value: dayjs.unix(row.lastOnline).format('DD/MM/YYYY à hh:mm') }
            ])
            .setAuthor({ name: row.name })
            .setThumbnail(`https://cdn.wibbo.me/habbo-imaging/avatarimage?figure=${row.look}&action=wav&direction=3&head_direction=4&size=s`);

        message.channel.send({ embeds: [embed] });
    }

    isNumber(value: string | number): boolean
    {
        return value != null && value !== '' && !isNaN(Number(value.toString()));
    }
}

import { Message, PermissionResolvable, MessageEmbed } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import dayjs from 'dayjs';
import { UserEntity } from '../../../database/entities/UserEntity';

export class UserInfoCommand extends Command
{
    constructor()
    {
        const permissions: PermissionResolvable[] = ['ADMINISTRATOR'];
        const roles: RolesString[] = ['Administrateur', 'Gestion'];

        super(permissions, roles, 'userinfo', 'infouser');
    }

    async parse(message: Message, parts: string[])
    {
        if(!parts.length) return;

        const usernameOrId = parts[0];

        let row: UserEntity = null;
        if(this.isNumber(usernameOrId))
            row = await UserDao.getUserById(parseInt(usernameOrId));

        if(!row) row = await UserDao.getUserByName(usernameOrId);

        if(!row)
        {
            message.reply(`L'utilisateur ${usernameOrId} n'existe pas !`);
            return;
        }

        const embed = new MessageEmbed()
            .setColor('#357EC7')
            .setTitle('Information sur ' + row.name)
            .setURL('https://wibbo.org/profil/' + row.name)
            .addField('Id', row.id.toString())
            .addField('Mission', row.motto ? row.motto : 'Aucune mission')
            .addField('Email', row.mail ? row.mail : 'Aucune email')
            .addField('Pays', row.ipCountry ? row.ipCountry : 'Non localisé')
            .addField('Statut', row.online == 1 ? 'En ligne' : 'Hors ligne')
            .addField('Crée le', dayjs.unix(row.accountCreated).format('DD/MM/YYYY à hh:mm'))
            .setAuthor(row.name)
            .setThumbnail(
                `https://cdn.wibbo.me/habbo-imaging/avatarimage?figure=${row.look}&action=wav&direction=3&head_direction=4&size=s`
            );

        message.channel.send({ embeds: [embed] });
    }

    isNumber(value: string | number): boolean
    {
        return value != null && value !== '' && !isNaN(Number(value.toString()));
    }
}

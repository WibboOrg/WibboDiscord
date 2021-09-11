import { Message, PermissionResolvable, RichEmbed } from 'discord.js';
import { Command } from '../Command';
import { RolesString } from '../RolesString';
import { UserDao } from '../../../database/daos/UserDao';
import moment from 'moment';

export class UserInfoCommand extends Command 
{
    constructor() 
    {
        const permissions: PermissionResolvable[] = ["ADMINISTRATOR"];
        const roles: RolesString[] = ["Administrateur", "Gestion"];

        super(permissions, roles, "userinfo", "infouser");
    }

    public async parse(message: Message, parts: string[])
    {
        if (!parts.length) return;

        const usernameOrId = parts[0];

        let row = null;
        if(this.isNumber(usernameOrId))
            row = await UserDao.getUserById(parseInt(usernameOrId));
        
        if(!row) row = await UserDao.getUserByName(usernameOrId);

        if (!row) { message.reply(`L'utilisateur ${ usernameOrId } n'existe pas !`); return; }

        const embed = new RichEmbed()
            .setColor('#357EC7')
            .setTitle("Information sur " + row.name)
            .setURL("https://wibbo.org/profil/" + row.name)
            .addField("Id", row.id)
            .addField("Mission", (row.motto) ? row.motto : 'Aucune mission')
            .addField("Email", (row.mail) ? row.mail : 'Aucune email')
            .addField("Pays", (row.ipCountry) ? row.ipCountry : 'Non localisé')
            .addField("Statut", row.online == 1 ? 'En ligne' : 'Hors ligne')
            .addField("Crée le", moment.unix(row.accountCreated).format('DD/MM/YYYY à hh:mm'))
            .setAuthor(row.name)
            .setThumbnail(`https://cdn.wibbo.me/habbo-imaging/avatarimage?figure=${ row.look }&action=wav&direction=3&head_direction=4&size=s`)
            // .setTimestamp()
            // .setFooter('Wibbo.org', 'https://cdn.discordapp.com/emojis/532140688167665664.png');

        message.channel.send(embed);
    }

    private isNumber(value: string | number): boolean
    {
        return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
    }
}
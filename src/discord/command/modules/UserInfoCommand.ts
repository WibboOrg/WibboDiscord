import { Message, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { UserDao } from '../../../database/daos/UserDao'
import dayjs from 'dayjs'
import { isNumber } from '../../utils'
import { User } from '@wibbo/prisma'
import { ICommand } from '../../types'

export default {
    name: 'userinfo',
    permissions: [PermissionFlagsBits.Administrator],
    roles: ['Administrateur', 'Gestion'],

    parse: async (message: Message, parts: string[]) => {
        if(!parts.length) return

        const usernameOrId = parts[0]

        if(usernameOrId === '')
        {
            message.reply('Veuillez mettre un no d\'utilisateur ou un ID en premier argument')
            return
        }

        let row: User | null = null
        if(isNumber(usernameOrId))
            row = await UserDao.getUserById(parseInt(usernameOrId))

        if(!row) row = await UserDao.getUserByNameOrMail(usernameOrId)

        if(!row)
        {
            message.reply(`L'utilisateur ${usernameOrId} n'existe pas !`)
            return
        }

        const embed = new EmbedBuilder()
            .setColor('#357EC7')
            .setTitle('Information sur ' + row.username)
            .setURL('https://wibbo.org/profil/' + row.username)
            .addFields([
                { name: 'Id', value: row.id.toString() },
                { name: 'Mission', value: row.motto ? row.motto : 'Aucune mission' },
                { name: 'Email', value: row.mail ? row.mail : 'Aucune e-mail' },
                { name: 'Pays', value: row.ipcountry ? row.ipcountry : 'Non localisé' },
                { name: 'Statut', value: row.online ? 'En ligne' : 'Hors-ligne' },
                { name: 'Crée le', value: dayjs.unix(row.accountCreated).format('DD/MM/YYYY à hh:mm') },
                { name: 'Dernière connexion', value: dayjs.unix(row.lastOnline).format('DD/MM/YYYY à hh:mm') }
            ])
            .setAuthor({ name: row.username })
            .setThumbnail(`https://imaging.wibbo.org/?figure=${row.look}&action=wav&direction=3&head_direction=4&size=s`)

        message.channel.send({ embeds: [embed] })
    }
} satisfies ICommand

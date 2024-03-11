import { LogLootboxDao } from '../../../database/daos/LogLootboxDao'
import { getTime } from '../../utils'
import { ILog } from '../../types'

export default {
    seconds: 10,
    channelName: 'logs_lootbox',
    getLastId: async () => await LogLootboxDao.getLastId(),

    rawLogs: async (lastId: number) => {
        const rows = await LogLootboxDao.loadLastLog(lastId)

        if(!rows) return

        if(!rows.length) return

        let message = ''
        for(const row of rows)
        {
            message += '**' + row.user.username + '** à ' + getTime(row.timestamp) + ' (' + row.interactionType + '): `' + row.itemBase.itemName + ' ('+ getRarity(row.itemBase.rarityLevel) +')`\n'

            if (row.id > lastId)
                lastId = row.id
        }

        return { message, lastId }
    }
} satisfies ILog

const getRarity = (rarity: number): string => {
    switch(rarity)
    {
        case 1:
            return 'Basique'
        case 2:
            return 'Commun'
        case 3:
            return 'Epic'
        case 4:
            return 'Légendaire'
        default:
            return 'Rare'
    }
}